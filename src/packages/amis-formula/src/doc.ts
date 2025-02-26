/**
 * 公式文档 请运行 `npm run genDoc` 自动生成
 */

import {bulkRegisterFunctionDoc} from './function';

bulkRegisterFunctionDoc([
  {
    name: "IF",
    description: "If the condition is met, it returns consequent, otherwise it returns alternate. It supports multi-layer nested IF functions.\n\nEquivalent to directly using JS expressions such as: condition ? consequent : alternate.",
    example: "IF(condition, consequent, alternate)",
    params: [
      {
        type: "expression",
        name: "condition",
        description: "conditional expression. For example: Chinese score>80"
      },
      {
        type: "any",
        name: "consequent",
        description: "The result returned if the condition is passed"
      },
      {
        type: "any",
        name: "alternate",
        description: "The result returned if the condition fails"
      }
    ],
    namespace: ""
  },
  {
    name: "AND",
    description: "If all conditions are met, return true, otherwise return false.\n\nExample: AND(Chinese score>80, Mathematics score>80),\n\nIf both the Chinese and math scores are greater than 80, it returns true, otherwise it returns false.\n\nEquivalent to using JS expressions directly such as: Chinese score>80 && Math score>80.",
    example: "AND(expression1, expression2, ...expressionN)",
    params: [
      {
        type: "...expression",
        name: "conditions",
        description: "Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80"
      }
    ],
    namespace: ""
  },
  {
    name: "OR",
    description: "If any of the conditions are met, return true, otherwise return false.\n\nExample: OR (Chinese score>80, Mathematics score>80),\n\nIf either the Chinese score or the math score is greater than 80, then return true, otherwise return false.\n\nEquivalent to using JS expressions directly such as: Chinese score>80 || Math score>80.",
    example: "OR(expression1, expression2, ...expressionN)",
    params: [
      {
        type: "...expression",
        name: "conditions",
        description: "Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80"
      }
    ],
    namespace: ""
  },
  {
    name: "XOR",
    description: "XOR processing, multiple expression groups are considered true when there are an odd number of true ones.\n\nExample: XOR(Chinese score > 80, Mathematics score > 80, English score > 80)\n\nIf one or all of the three scores are greater than 80, return true, otherwise return false.",
    example: "XOR(condition1, condition2, ...expressionN)",
    params: [
      {
        type: "...expression",
        name: "condition",
        description: "Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80"
      }
    ],
    namespace: ""
  },
  {
    name: "IFS",
    description: "A set of judgment functions, equivalent to combining multiple else if statements into one.\n\nExample: IFS (Chinese score > 80, \"Excellent\", Chinese score > 60, \"Good\", \"Keep working hard\"),\n\nIf the Chinese score is greater than 80, return \"Excellent\", otherwise if it is greater than 60, return \"Good\", otherwise return \"Keep working hard\".",
    example: "IFS(condition1, result1, condition2, result2,...conditionN, resultN)",
    params: [
      {
        type: "...expression",
        name: "condition",
        description: "conditional expression"
      },
      {
        type: "...any",
        name: "result",
        description: "return value"
      }
    ],
    namespace: ""
  },
  {
    name: "ABS",
    description: "Returns the absolute value of the passed number.",
    example: "ABS(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "value"
      }
    ],
    namespace: ""
  },
  {
    name: "MAX",
    description: "Get the maximum value. If there is only one parameter and it is an array, calculate the value in the array.",
    example: "MAX(num1, num2, ...numN) or MAX([num1, num2, ...numN])",
    params: [
      {
        type: "...number",
        name: "num",
        description: "value"
      }
    ],
    namespace: ""
  },
  {
    name: "MIN",
    description: "Get the minimum value. If there is only one parameter and it is an array, calculate the value in the array.",
    example: "MIN(num1, num2, ...numN) or MIN([num1, num2, ...numN])",
    params: [
      {
        type: "...number",
        name: "num",
        description: "value"
      }
    ],
    namespace: ""
  },
  {
    name: "SUM",
    description: "Sum. If there is only one parameter and it is an array, calculate the value in the array.",
    example: "SUM(num1, num2, ...numN) or SUM([num1, num2, ...numN])",
    params: [
      {
        type: "...number",
        name: "num",
        description: "value"
      }
    ],
    namespace: ""
  },
  {
    name: "INT",
    description: "Rounds a value down to the nearest integer.",
    example: "INT(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "value"
      }
    ],
    namespace: ""
  },
  {
    name: "MOD",
    description: "Returns the remainder after dividing two numbers. The parameter number is the dividend and divisor is the divisor.",
    example: "MOD(num, divisor)",
    params: [
      {
        type: "number",
        name: "num",
        description: "the dividend"
      },
      {
        type: "number",
        name: "divisor",
        description: "divisor"
      }
    ],
    namespace: ""
  },
  {
    name: "PI",
    description: "Pi is 3.1415…",
    example: "PI()",
    params: [],
    namespace: ""
  },
  {
    name: "ROUND",
    description: "Rounds a number to a specified number of decimal places.",
    example: "ROUND(num[, numDigits = 2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "the number to be processed"
      },
      {
        type: "number",
        name: "numDigits",
        description: "the number of decimal places, default is 2"
      }
    ],
    namespace: ""
  },
  {
    name: "FLOOR",
    description: "Rounds a number down to the specified number of decimal places.",
    example: "FLOOR(num[, numDigits=2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "the number to be processed"
      },
      {
        type: "number",
        name: "numDigits",
        description: "the number of decimal places, default is 2"
      }
    ],
    namespace: ""
  },
  {
    name: "CEIL",
    description: "Rounds a number up to the specified number of decimal places.",
    example: "CEIL(num[, numDigits=2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "the number to be processed"
      },
      {
        type: "number",
        name: "numDigits",
        description: "the number of decimal places, default is 2"
      }
    ],
    namespace: ""
  },
  {
    name: "SQRT",
    description: "Square root, parameter number is a non-negative number",
    example: "SQRT(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "AVG",
    description: "Returns the average value of all parameters. If there is only one parameter and it is an array, calculates the value in the array.",
    example: "AVG(num1, num2, ...numN) or AVG([num1, num2, ...numN])",
    params: [
      {
        type: "...number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "DEVSQ",
    description: "Returns the sum of the squares of the differences between the data point and the data mean point (data deviation). If there is only one parameter and it is an array, the value in the array is calculated.",
    example: "DEVSQ(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "AVEDEV",
    description: "The average of the absolute deviations of the data points from their arithmetic mean.",
    example: "AVEDEV(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "HARMEAN",
    description: "The harmonic mean of the data points. If there is only one parameter and it is an array, the value in the array is calculated.",
    example: "HARMEAN(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "LARGE",
    description: "The kth largest value in the data set.",
    example: "LARGE(array, k)",
    params: [
      {
        type: "array",
        name: "nums",
        description: "the numbers to be processed"
      },
      {
        type: "number",
        name: "k",
        description: "the largest number"
      }
    ],
    namespace: ""
  },
  {
    name: "UPPERMONEY",
    description: "Convert the value to Chinese uppercase amount.",
    example: "UPPERMONEY(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "the number to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "RAND",
    description: "Returns a uniformly distributed random real number greater than or equal to 0 and less than 1. The calculation changes every time it is triggered.\n\nExample: `RAND()*100`,\n\nReturns a random number between 0-100.",
    example: "RAND()",
    params: [],
    namespace: ""
  },
  {
    name: "LAST",
    description: "Get the last data.",
    example: "LAST(array)",
    params: [
      {
        type: "...number",
        name: "arr",
        description: "the array to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "POW",
    description: "Returns the exponential power of the base. The parameter base is the base and exponent is the exponent. If the parameter value is illegal, the base itself is returned. If the calculation result is illegal, NaN is returned.",
    example: "POW(base, exponent)",
    params: [
      {
        type: "number",
        name: "base",
        description: "base"
      },
      {
        type: "number",
        name: "exponent",
        description: "exponent"
      }
    ],
    namespace: ""
  },
  {
    name: "LEFT",
    description: "Returns a string of the specified length from the left side of the passed text.",
    example: "LEFT(text, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      },
      {
        type: "number",
        name: "len",
        description: "the length to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "RIGHT",
    description: "Returns a string of the specified length from the right side of the passed text.",
    example: "RIGHT(text, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      },
      {
        type: "number",
        name: "len",
        description: "the length to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "LEN",
    description: "Calculate the length of the text.",
    example: "LEN(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "LENGTH",
    description: "Calculate the length of all text in a text collection.",
    example: "LENGTH(textArr)",
    params: [
      {
        type: "Array<string>",
        name: "textArr",
        description: "the text collection to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "ISEMPTY",
    description: "Check if the text is empty.",
    example: "ISEMPTY(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "CONCATENATE",
    description: "Concatenate multiple incoming values ​​into text.",
    example: "CONCATENATE(text1, text2, ...textN)",
    params: [
      {
        type: "...string",
        name: "text",
        description: "text collection"
      }
    ],
    namespace: ""
  },
  {
    name: "CHAR",
    description: "Returns the character corresponding to the numeric code of the computer's character set.\n\nExample: `CHAR(97)` is equivalent to \"a\".",
    example: "CHAR(code)",
    params: [
      {
        type: "number",
        name: "code",
        description: "the encoding value"
      }
    ],
    namespace: ""
  },
  {
    name: "LOWER",
    description: "Convert the incoming text to lowercase.",
    example: "LOWER(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "UPPER",
    description: "Convert the incoming text to uppercase.",
    example: "UPPER(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "UPPERFIRST",
    description: "Convert the first letter of the incoming text to uppercase.",
    example: "UPPERFIRST(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "PADSTART",
    description: "Pad forward to the length of the text.\n\nExample `PADSTART(\"6\", 2, \"0\")`,\n\nReturns `06`.",
    example: "PADSTART(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "number",
        name: "num",
        description: "target length"
      },
      {
        type: "string",
        name: "pad",
        description: "the text to use for padding"
      }
    ],
    namespace: ""
  },
  {
    name: "CAPITALIZE",
    description: "Convert text to titles.\n\nExample `CAPITALIZE(\"star\")`,\n\nReturns `Star`.",
    example: "CAPITALIZE(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "ESCAPE",
    description: "HTML escape the text.\n\nExample `ESCAPE(\"<star>&\")`,\n\nReturns `<start>&`.",
    example: "ESCAPE(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "TRUNCATE",
    description: "Truncate the text length.\n\nExample `TRUNCATE(\"amis.baidu.com\", 6)`,\n\nReturns `amis...`.",
    example: "TRUNCATE(text, 6)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "number",
        name: "text",
        description: "maximum length"
      }
    ],
    namespace: ""
  },
  {
    name: "BEFORELAST",
    description: "Take all the strings before a certain delimiter.",
    example: "BEFORELAST(text, '.')",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "string",
        name: "delimiter",
        description: "end text"
      }
    ],
    namespace: ""
  },
  {
    name: "SPLIT",
    description: "Split the text into an array based on the specified fragment.\n\nExample: `SPLIT(\"a,b,c\", \",\")`,\n\nReturns `[\"a\", \"b\", \"c\"]`.",
    example: "SPLIT(text, ',')",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "string",
        name: "delimiter",
        description: "text fragment"
      }
    ],
    namespace: ""
  },
  {
    name: "TRIM",
    description: "Remove leading and trailing spaces from the text.",
    example: "TRIM(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "STRIPTAG",
    description: "Remove HTML tags from text.\n\nExample: `STRIPTAG(\"<b>amis</b>\")`,\n\nReturns: `amis`.",
    example: "STRIPTAG(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "LINEBREAK",
    description: "Convert line breaks in strings to HTML `<br>` for simple line breaks.\n\nExample: `LINEBREAK(\"\\n\")`,\n\nReturns: `<br/>`.",
    example: "LINEBREAK(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      }
    ],
    namespace: ""
  },
  {
    name: "STARTSWITH",
    description: "Determines whether the string (text) starts with a specific string (startString), and returns true if it does, otherwise returns false.",
    example: "STARTSWITH(text, 'fragment')",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "string",
        name: "startString",
        description: "starting text"
      }
    ],
    namespace: ""
  },
  {
    name: "ENDSWITH",
    description: "Determines whether the string (text) ends with a specific string (endString), and returns true if it does, otherwise returns false.",
    example: "ENDSWITH(text, 'fragment')",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "string",
        name: "endString",
        description: "end text"
      }
    ],
    namespace: ""
  },
  {
    name: "CONTAINS",
    description: "Determines whether the text in parameter 1 contains the text in parameter 2. If so, returns true; otherwise, returns false.",
    example: "CONTAINS(text, searchText)",
    params: [
      {
        type: "string",
        name: "text",
        description: "text"
      },
      {
        type: "string",
        name: "searchText",
        description: "search text"
      }
    ],
    namespace: ""
  },
  {
    name: "REPLACE",
    description: "Replace all text.",
    example: "REPLACE(text, search, replace)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      },
      {
        type: "string",
        name: "search",
        description: "the text to be replaced"
      },
      {
        type: "string",
        name: "replace",
        description: "the text to replace"
      }
    ],
    namespace: ""
  },
  {
    name: "SEARCH",
    description: "Search for text and return the location of the hit.",
    example: "SEARCH(text, search, 0)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      },
      {
        type: "string",
        name: "search",
        description: "the text to search for"
      },
      {
        type: "number",
        name: "start",
        description: "starting position"
      }
    ],
    namespace: ""
  },
  {
    name: "MID",
    description: "Returns a specific number of characters from a text string starting at a specified position.\n\nExample: `MID(\"amis.baidu.com\", 6, 3)`,\n\nReturns `aid`.",
    example: "MID(text, from, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      },
      {
        type: "number",
        name: "from",
        description: "starting position"
      },
      {
        type: "number",
        name: "len",
        description: "processing length"
      }
    ],
    namespace: ""
  },
  {
    name: "BASENAME",
    description: "Returns the file name in path.\n\nExample: `/home/amis/a.json`,\n\nReturns: `a.json`.",
    example: "BASENAME(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "the text to be processed"
      }
    ],
    namespace: ""
  },
  {
    name: "UUID",
    description: "Generate UUID string",
    example: "UUID(8)",
    params: [
      {
        type: "number",
        name: "length",
        description: "the length of the generated UUID string, default is 32 bits"
      }
    ],
    namespace: ""
  },
  {
    name: "DATE",
    description: "Create a date object, either by a string in a specific format or by a numeric value.\n\nNote that the month value starts from 0.\nThat is, if it is December, you should pass in the value 11.",
    example: "DATE('2021-12-06 08:20:00')",
    params: [],
    namespace: ""
  },
  {
    name: "TIMESTAMP",
    description: "Returns the timestamp of the time.",
    example: "TIMESTAMP(date[, format = \"X\"])",
    params: [],
    namespace: ""
  },
  {
    name: "TODAY",
    description: "Returns today's date.",
    example: "TODAY()",
    params: [],
    namespace: ""
  },
  {
    name: "NOW",
    description: "Returns the current date",
    example: "NOW()",
    params: [],
    namespace: ""
  },
  {
    name: "WEEKDAY",
    description: "Get the day of the week for a date.\n\nExample\n\nWEEKDAY('2023-02-27') returns 0.\nWEEKDAY('2023-02-27', 2) returns 1.",
    example: "WEEKDAY(date)",
    params: [],
    namespace: ""
  },
  {
    name: "WEEK",
    description: "Get the week of the year, that is, the number of weeks.\n\nExample\n\nWEEK('2023-03-05') yields 9.",
    example: "WEEK(date)",
    params: [],
    namespace: ""
  },
  {
    name: "DATETOSTR",
    description: "Format dates, date strings, and timestamps.\n\nExample\n\nDATETOSTR('12/25/2022', 'YYYY-MM-DD') gives '2022.12.25',\nDATETOSTR(1676563200, 'YYYY.MM.DD') gives '2023.02.17',\nDATETOSTR(1676563200000, 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',\nDATETOSTR(DATE('2021-12-21'), 'YYYY.MM.DD hh:mm:ss') 得到 '2021.12.21 08:00:00'。",
    example: "DATETOSTR(date, 'YYYY-MM-DD')",
    params: [],
    namespace: ""
  },
  {
    name: "DATERANGESPLIT",
    description: "Get the start time and end time in the date range string.\n\nExample:\n\nDATERANGESPLIT('1676563200, 1676735999') gets [1676563200, 1676735999],\nDATERANGESPLIT('1676563200, 1676735999', undefined , 'YYYY.MM.DD hh:mm:ss') 得到 [2023.02.17 12:00:00, 2023.02.18 11:59:59]，\nDATERANGESPLIT('1676563200, 1676735999', 0 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',\nDATERANGESPLIT('1676563200, 1676735999', 'start' , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',\nDATERANGESPLIT('1676563200, 1676735999', 1 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.18 11:59:59',\nDATERANGESPLIT('1676563200, 1676735999', 'end' , 'YYYY.MM.DD hh:mm:ss') gives '2023.02.18 11:59:59'.",
    example: "DATERANGESPLIT(date, 'YYYY-MM-DD')",
    params: [],
    namespace: ""
  },
  {
    name: "STARTOF",
    description: "Returns the start of a specified range of dates.",
    example: "",
    params: [],
    namespace: ""
  },
  {
    name: "ENDOF",
    description: "Returns the end of a specified range of dates.",
    example: "",
    params: [],
    namespace: ""
  },
  {
    name: "YEAR",
    description: "Returns the year of a date.",
    example: "",
    params: [],
    namespace: ""
  },
  {
    name: "MONTH",
    description: "Returns the month of the date, here is the natural month.",
    example: "",
    params: [],
    namespace: ""
  },
  {
    name: "DAY",
    description: "Returns the day of a date.",
    example: "",
    params: [],
    namespace: ""
  },
  {
    name: "HOUR",
    description: "Returns the hour of a date.",
    example: "",
    params: [
      {
        type: "date",
        name: "date",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "MINUTE",
    description: "Returns the minute of a date.",
    example: "",
    params: [
      {
        type: "date",
        name: "date",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "SECOND",
    description: "Returns the seconds of a date.",
    example: "",
    params: [
      {
        type: "date",
        name: "date",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "YEARS",
    description: "Returns the number of years between two dates.",
    example: "",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "date object"
      },
      {
        type: "date",
        name: "startDate",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "MINUTES",
    description: "Returns the number of minutes between two dates.",
    example: "",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "date object"
      },
      {
        type: "date",
        name: "startDate",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "DAYS",
    description: "Returns the number of days between two dates.",
    example: "",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "date object"
      },
      {
        type: "date",
        name: "startDate",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "HOURS",
    description: "Returns the number of hours between two dates.",
    example: "",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "date object"
      },
      {
        type: "date",
        name: "startDate",
        description: "date object"
      }
    ],
    namespace: ""
  },
  {
    name: "DATEMODIFY",
    description: "Modify the date by adding or subtracting days, months, years, etc.\n\nExample:\n\nDATEMODIFY(A, -2, 'month')，\n\nSubtract 2 months from date A.",
    example: "",
    params: [
      {
        type: "date",
        name: "date",
        description: "date object"
      },
      {
        type: "number",
        name: "num",
        description: "value"
      },
      {
        type: "string",
        name: "unit",
        description: ": supports year, month, day, etc."
      }
    ],
    namespace: ""
  },
  {
    name: "STRTODATE",
    description: "Convert a string date into a date object. You can specify the date format.\n\nExample: STRTODATE('2021/12/6', 'YYYY/MM/DD')",
    example: "",
    params: [
      {
        type: "string",
        name: "value",
        description: "date character"
      },
      {
        type: "string",
        name: "format",
        description: "date format"
      }
    ],
    namespace: ""
  },
  {
    name: "ISBEFORE",
    description: "Determine whether the first date is before the second date. If yes, return true; otherwise, return false.",
    example: "",
    params: [
      {
        type: "date",
        name: "a",
        description: "first date"
      },
      {
        type: "date",
        name: "b",
        description: "second date"
      },
      {
        type: "string",
        name: "unit",
        description: "unit, default is 'day', that is, compare to day"
      }
    ],
    namespace: ""
  },
  {
    name: "ISAFTER",
    description: "Determine whether the first date is after the second date. If so, return true; otherwise, return false.",
    example: "",
    params: [
      {
        type: "date",
        name: "a",
        description: "first date"
      },
      {
        type: "date",
        name: "b",
        description: "second date"
      },
      {
        type: "string",
        name: "unit",
        description: "unit, default is 'day', that is, compare to day"
      }
    ],
    namespace: ""
  },
  {
    name: "BETWEENRANGE",
    description: "Check if the date is within the specified range, if yes, return true, otherwise return false.\n\nExample: BETWEENRANGE('2021/12/6', ['2021/12/5','2021/12/7']).",
    example: "",
    params: [
      {
        type: "any",
        name: "date",
        description: "first date"
      },
      {
        type: "Array<any>",
        name: "daterange",
        description: "date range"
      },
      {
        type: "string",
        name: "unit",
        description: "unit, default is 'day', that is, compare to day"
      },
      {
        type: "string",
        name: "inclusivity",
        description: "Inclusivity rule, default is '[]'. [ means inclusion, ( means exclusion. If the inclusive parameter is used, two indicators must be passed in, such as '()' means both the left and right ranges are excluded."
      }
    ],
    namespace: ""
  },
  {
    name: "ISSAMEORBEFORE",
    description: "Determines whether the first date is before or equal to the second date. If so, returns true; otherwise, returns false.",
    example: "",
    params: [
      {
        type: "date",
        name: "a",
        description: "first date"
      },
      {
        type: "date",
        name: "b",
        description: "second date"
      },
      {
        type: "string",
        name: "unit",
        description: "unit, default is 'day', that is, compare to day"
      }
    ],
    namespace: ""
  },
  {
    name: "ISSAMEORAFTER",
    description: "Determines whether the first date is after or equal to the second date. If so, returns true; otherwise, returns false.",
    example: "",
    params: [
      {
        type: "date",
        name: "a",
        description: "first date"
      },
      {
        type: "date",
        name: "b",
        description: "second date"
      },
      {
        type: "string",
        name: "unit",
        description: "unit, default is 'day', that is, compare to day"
      }
    ],
    namespace: ""
  },
  {
    name: "COUNT",
    description: "Returns the length of the array.",
    example: "COUNT(arr)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      }
    ],
    returns: {
      type: "number",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ARRAYMAP",
    description: "Arrays need to be used with arrow functions for data conversion. Note that arrow functions only support single expression usage.\n\nConvert each element in the array to the value returned by the arrow function.\n\nExample:\n\nARRAYMAP([1, 2, 3], item => item + 1) gives [2, 3, 4].",
    example: "ARRAYMAP(arr, item => item)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "returns the converted array"
    },
    namespace: "array"
  },
  {
    name: "ARRAYFILTER",
    description: "To filter data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.\nFilter out members whose second arrow function returns false.\n\nExample:\n\nARRAYFILTER([1, 2, 3], item => item > 1) yields [2, 3].",
    example: "ARRAYFILTER(arr, item => item)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "returns the filtered array"
    },
    namespace: "array"
  },
  {
    name: "ARRAYFINDINDEX",
    description: "To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.\nFind the index of the member for which the second arrow function returns true.\n\nExample:\n\nARRAYFINDINDEX([0, 2, false], item => item === 2) returns 1.",
    example: "ARRAYFINDINDEX(arr, item => item === 2)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "number",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ARRAYFIND",
    description: "To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.\nFind the member whose second arrow function returns true.\n\nExample:\n\nARRAYFIND([0, 2, false], item => item === 2) gets 2.",
    example: "ARRAYFIND(arr, item => item === 2)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "any",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ARRAYSOME",
    description: "To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.\nDetermine whether the second arrow function has a member that returns true. If so, return true; otherwise, return false.\n\nExample:\n\nARRAYSOME([0, 2, false], item => item === 2) returns true.",
    example: "ARRAYSOME(arr, item => item === 2)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "boolean",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ARRAYEVERY",
    description: "To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.\nDetermine whether the second arrow function returns true. If so, return true; otherwise, return false.\n\nExample:\n\nARRAYEVERY([0, 2, false], item => item === 2) returns false",
    example: "ARRAYEVERY(arr, item => item === 2)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "arrow function"
      }
    ],
    returns: {
      type: "boolean",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ARRAYINCLUDES",
    description: "Determine whether the specified element exists in the data.\n\nExample:\n\nARRAYINCLUDES([0, 2, false], 2) returns true.",
    example: "ARRAYINCLUDES(arr, 2)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "any",
        name: "item",
        description: "element"
      }
    ],
    returns: {
      type: "any",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "COMPACT",
    description: "The array filters out false, null, 0 and \"\".\n\nExample:\n\nCOMPACT([0, 1, false, 2, '', 3]) yields [1, 2, 3].",
    example: "COMPACT(arr)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "JOIN",
    description: "Convert array to string.\n\nExample:\n\nJOIN(['a', 'b', 'c'], '=') results in 'a=b=c'.",
    example: "JOIN(arr, string)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "String",
        name: "separator",
        description: "separator"
      }
    ],
    returns: {
      type: "string",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "CONCAT",
    description: "Array merging.\n\nExample:\n\nCONCAT(['a', 'b', 'c'], ['1'], ['3']) gives ['a', 'b', 'c', '1', '3'].",
    example: "CONCAT(['a', 'b', 'c'], ['1'], ['3'])",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "UNIQ",
    description: "Array deduplication, the second parameter \"field\" can specify the field to be deduplicated.\n\nExample:\n\nUNIQ([{a: '1'}, {b: '2'}, {a: '1'}]) gets [{a: '1'}, {b: '2'}].",
    example: "UNIQ([{a: '1'}, {b: '2'}, {a: '1'}], 'x')",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "array"
      },
      {
        type: "string",
        name: "field",
        description: "field"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "result"
    },
    namespace: "array"
  },
  {
    name: "ENCODEJSON",
    description: "Convert a JS object to a JSON string.\n\nExample:\n\nENCODEJSON({name: 'amis'}) returns '{\"name\":\"amis\"}'.",
    example: "ENCODEJSON({name: 'amis'})",
    params: [
      {
        type: "object",
        name: "obj",
        description: "JS object"
      }
    ],
    returns: {
      type: "string",
      description: "result"
    },
    namespace: "encoding"
  },
  {
    name: "DECODEJSON",
    description: "Parse JSON encoded data and return a JS object.\n\nExample:\n\nDECODEJSON('{\\\"name\\\": \"amis\"}') gets {name: 'amis'}.",
    example: "DECODEJSON('{\\\"name\\\": \"amis\"}')",
    params: [
      {
        type: "string",
        name: "str",
        description: "string"
      }
    ],
    returns: {
      type: "object",
      description: "result"
    },
    namespace: "encoding"
  },
  {
    name: "GET",
    description: "Get the value according to the path of the object or array. If the parsed value is undefined, it will be replaced by defaultValue.\n\nExample:\n\nGET([0, 2, {name: 'amis', age: 18}], 1) gets 2,\nGET([0, 2, {name: 'amis', age: 18}], '2.name') gets 'amis',\nGET({arr: [{name: 'amis', age: 18}]}, 'arr[0].name') 得到 'amis'，\nGET({arr: [{name: 'amis', age: 18}]}, 'arr.0.name') 得到 'amis'，\nGET({arr: [{name: 'amis', age: 18}]}, 'arr.1.name', 'not-found') 得到 'not-found'。",
    example: "GET(arr, 2)",
    params: [
      {
        type: "any",
        name: "obj",
        description: "object or array"
      },
      {
        type: "string",
        name: "path",
        description: "path"
      },
      {
        type: "any",
        name: "defaultValue",
        description: "If the value cannot be parsed, the default value will be returned"
      }
    ],
    returns: {
      type: "any",
      description: "result"
    },
    namespace: "other"
  },
  {
    name: "ISTYPE",
    description: "Check whether the type is supported: string, number, array, date, plain-object.",
    example: "ISTYPE([{a: '1'}, {b: '2'}, {a: '1'}], 'array')",
    params: [
      {
        type: "string",
        name: "judgment",
        description: "object"
      }
    ],
    returns: {
      type: "boolean",
      description: "result"
    },
    namespace: "other"
  }
]);
