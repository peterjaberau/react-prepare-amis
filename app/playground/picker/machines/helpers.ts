import * as R from "remeda"

import {
  libraryStaticImageResources
} from "./data";
import request, { gql } from "graphql-request";

/*
  utils methods:
  - getPaginatedLibraryResources({resources: any[]})
  - getRandomString(length: number): string
  - getRandomNumberFromN(N: number): number
  - cfl(string: string): string
  - beautifyObjectName(string: string): string
  - beautifySlug(string: string): string
  - formatShopifyUrlImage(url: string, options: { width?: number, height?: number, crop?: "bottom" | "center" | "left" | "right" | "top", scale?: 2 | 3 }): string
  - getPaginatedItems<T extends { cursor: number }>(items: T[], first: number, after?: number): { data: T[], pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, endCursor: number } }

 */

export const getPaginatedLibraryResources = ({resources}: any) => {
  const sortedResources = resources.sort((a: any, b: any) => a.cursor - b.cursor)
  return ({first, after, filters, query}: any) => {
    const lowercaseQuery = query?.toLowerCase()
    if (!sortedResources.length) {
      return {
        data: [],
        pageInfo: {hasNextPage: false, hasPreviousPage: false, latestCursor: after || 0},
      }
    }

    const allFilteredResources = filters
      ? sortedResources.filter((r: any) => {
        return (
          R.keys(filters)
            .map((key) => {
              const f = filters[key]
              return f.length === 0 || f.every((el: any) => r[key]?.includes(el))
            })
            .every(Boolean) &&
          (lowercaseQuery ? r.title["en-US"].toLowerCase().includes(lowercaseQuery) : true)
        )
      })
      : sortedResources

    const totalAllFilteredResources = allFilteredResources.length

    if (!totalAllFilteredResources) {
      return {
        data: [],
        pageInfo: {hasNextPage: false, hasPreviousPage: false, latestCursor: after || 0},
      }
    }

    const startIndex = after ? allFilteredResources.findIndex((r: any) => r.cursor > after) : 0

    if (startIndex === -1) {
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: after !== undefined,
          latestCursor: after || 0,
        },
      }
    }

    const endIndex = Math.min(startIndex + first, totalAllFilteredResources)
    const data = allFilteredResources.slice(startIndex, endIndex)

    const endCursor = data.length > 0 ? data[data.length - 1].cursor : after || 0

    return {
      data,
      pageInfo: {
        hasNextPage: endIndex < totalAllFilteredResources,
        hasPreviousPage: startIndex > 0,
        endCursor: endCursor,
      },
    }
  }
}

export const getRandomString = (length = 10) =>
  (Math.random() + 1).toString(36).substring(2, length + 2)

export const getRandomNumberFromN = (N: number): number => {
  return Math.floor(Math.random() * (N + 1))
}

export const cfl = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const beautifyObjectName = (string: string) => {
  let output = string.replaceAll(/([A-Z])/g, " $1")
  output = output.charAt(0).toUpperCase() + output.slice(1)
  return output
}

export const beautifySlug = (string: string) => {
  return cfl(string.replaceAll("-", " "))
}

export const formatShopifyUrlImage = (
  url: string,
  options: {
    width?: number
    height?: number
    crop?: "bottom" | "center" | "left" | "right" | "top"
    scale?: 2 | 3
  },
): string => {
  const {width, height, crop, scale} = options
  if (width == null && height == null) return url
  let newUrl: string[] | string = url.split(/(\.[A-Za-z]+\?.*$)/)
  if (newUrl.length < 3) return url

  newUrl = `${newUrl[0]}_${width ?? ""}x${height ?? ""}${
    crop ? `_crop_${crop}` : ""
  }${scale ? `@${scale}x` : ""}${newUrl[1]}`
  return newUrl
}

export const getPaginatedItems = <T extends { cursor: number }>(
  items: T[],
  first: number,
  after?: number,
) => {
  const totalItems = items.length

  if (totalItems === 0) {
    return {
      data: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        latestCursor: after || 0,
      },
    }
  }

  const startIndex = after ? items.findIndex((item) => item.cursor > after) : 0

  if (startIndex === -1) {
    return {
      data: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: after !== undefined,
        latestCursor: after || 0,
      },
    }
  }

  const endIndex = Math.min(startIndex + first, totalItems)
  const data = items.slice(startIndex, endIndex)

  return {
    data,
    pageInfo: {
      hasNextPage: endIndex < totalItems,
      hasPreviousPage: startIndex > 0,
      endCursor: data.length > 0 ? data[data.length - 1].cursor : after || 0,
    },
  }
}






/*
 Constants
 - defaultMessageError: string
*/
const defaultMessageError = "Something went wrong, this code is fked up"


/*
  Errors
 */
export const handleErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error
  if (typeof error === "object" && error != null) {
    // In case of HttpErrorClient
    if ("error" in error && Reflect.get(error, "error") != null) {
      return `${String(Reflect.get(error.error ?? {}, "message"))} type: ${String(
        Reflect.get(error.error ?? {}, "type"),
      )} code: ${String(Reflect.get(error.error ?? {}, "code"))}`
    }
    if ("message" in error) return String(Reflect.get(error, "message"))
    return defaultMessageError
  }
  return defaultMessageError
}



/*
  data queries
 */
export const getShopifyProducts = gql`
  query getShopifyProducts($first: Int!, $after: String, $query: String)
    {
      products(first: $first, after: $after, query: $query) {
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        edges {
          node {
            id
            title
            description
            featuredImage {
              id
              url
            }
            variants(first: 3) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  
`

export const getShopifyCollections = gql`
    query getShopifyCollections($first: Int!, $after: String, $query: String)
        {
        collections(first: $first, after: $after, query: $query) {
            pageInfo {
            hasNextPage
            endCursor
            hasPreviousPage
            startCursor
            }
            edges {
            node {
                id
                title
                description
                image {
                    url
                    }
                }
            }
        }
      }
    `




/*
  others
 */
export const rootPartialInput = {
  libraryStaticImage: {
    resourceSettings: {
      resourceNamespace: "library",
      resourceType: "libraryStaticImage",
      filtersHandler: async () => {
        return {
          filters: {tags: [...new Set(libraryStaticImageResources.flatMap((i) => i.tags))]},
        }
      },
      queryHandler: async (payload: any) => {
        if (payload.queryType === "shopify") {
          throw new Error(
            `Invalid library query received: ${JSON.stringify(
              payload,
            )}, might be due if you use the Shopify query formatting instead of the library one`,
          )
        }

        const items = handlePaginatedLibraryStaticImageResources({
          query: payload.query,
          first: payload.first,
          filters: {tags: payload.filters.tags ?? []},
          after: payload.endCursor ? Number(payload.endCursor) : undefined,
        })

        console.log({items})
        return {
          libraryItems: items.data.map((i: any) => ({
            tags: i.tags,
            updatedAt: new Date(i.updatedAt),
            cursor: i.cursor,
            resourceNamespace: "library",
            status: i.status,
            allowedPlanSlugs: ["all"],
            id: i.id,
            createdAt: i.createdAt,
            description: i.description,
            mainImageSrc: i.mainImageSrc,
            title: i.title,
            resource: {
              resourceType: "libraryStaticImage",
              title: i.title,
              data: {
                src: i.mainImageSrc,
              },
            },
          })),
          pageInfo: {
            hasNextPage: items.pageInfo.hasNextPage,
            hasPreviousPage: items.pageInfo.hasPreviousPage,
            endCursor: String(items.pageInfo.endCursor) || null,
          },
        }
      },
    },
  },
  product: {
    resourceSettings: {
      resourceNamespace: "shopify",
      queryHandler: async (payload: any) => {
        if (payload.queryType === "library") {
          throw new Error(
            `Invalid library query received: ${JSON.stringify(
              payload,
            )}, might be due if you use the Shopify query formatting instead of the library one`,
          )
        }

        const data = (await request("https://mock.shop/api", getShopifyProducts, {
          after: payload.endCursor,
          first: payload.first,
          query: payload.query,
        })) as any

        return {
          libraryItems: data.products.edges.map((edge: any) => ({
            allowedPlanSlugs: ["all"],
            id: edge.node.id,
            resourceNamespace: "shopify",
            mainImageSrc: edge.node.featuredImage.url,
            resource: {resourceType: "product", title: edge.node.title},
            title: edge.node.title,
          })),
          pageInfo: data.products.pageInfo,
        }
      },
      resourceType: "product",
    },
  },
  collection: {
    resourceSettings: {
      resourceNamespace: "shopify",
      queryHandler: async (payload: any) => {
        if (payload.queryType === "library") {
          throw new Error(
            `Invalid library query received: ${JSON.stringify(
              payload,
            )}, might be due if you use the Shopify query formatting instead of the library one`,
          )
        }

        const data = (await request("https://mock.shop/api", getShopifyCollections, {
          after: payload.endCursor,
          first: payload.first,
          query: payload.query,
        })) as any

        return {
          libraryItems: data.collections.edges.map((edge: any) => ({
            allowedPlanSlugs: ["all"],
            id: edge.node.id,
            resourceNamespace: "shopify",
            mainImageSrc: edge.node.image.url,
            resource: {resourceType: "product", title: edge.node.title},
            title: edge.node.title,
          })),
          pageInfo: data.collections.pageInfo,
        }
      },
      resourceType: "collection",
    },
  },
} satisfies { [type: string]: { resourceSettings: Partial<any> } }

export const isShopifyQueryQuery = (payload: any): boolean => {
  return typeof payload === "string"
}

export const handleInvokeError = ({event}: any): void => {
  console.error(event?.error)
}

export const handlePaginatedLibraryStaticImageResources = getPaginatedLibraryResources({
  resources: libraryStaticImageResources,
})



