## 其他

### IF

用法：`IF(condition, consequent, alternate)`

 * `condition:expression` conditional expression. For example: Chinese score>80
 * `consequent:any` The result returned if the condition is passed
 * `alternate:any` The result returned if the condition fails
If the condition is met, it returns consequent, otherwise it returns alternate. It supports multi-layer nested IF functions.

Equivalent to directly using JS expressions such as: condition ? consequent : alternate.

### AND

用法：`AND(expression1, expression2, ...expressionN)`

 * `conditions:...expression` Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
If all conditions are met, return true, otherwise return false.

Example: AND(Chinese score>80, Mathematics score>80),

If both the Chinese and math scores are greater than 80, it returns true, otherwise it returns false.

Equivalent to using JS expressions directly such as: Chinese score>80 && Math score>80.

### OR

用法：`OR(expression1, expression2, ...expressionN)`

 * `conditions:...expression` Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
If any of the conditions are met, return true, otherwise return false.

Example: OR (Chinese score>80, Mathematics score>80),

If either the Chinese score or the math score is greater than 80, then return true, otherwise return false.

Equivalent to using JS expressions directly such as: Chinese score>80 || Math score>80.

### XOR

用法：`XOR(condition1, condition2, ...expressionN)`

 * `condition:...expression` Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
XOR processing, multiple expression groups are considered true when there are an odd number of true ones.

Example: XOR(Chinese score > 80, Mathematics score > 80, English score > 80)

If one or all of the three scores are greater than 80, return true, otherwise return false.

### IFS

用法：`IFS(condition1, result1, condition2, result2,...conditionN, resultN)`

 * `condition:...expression` conditional expression
 * `result:...any` return value
A set of judgment functions, equivalent to combining multiple else if statements into one.

Example: IFS (Chinese score > 80, "Excellent", Chinese score > 60, "Good", "Keep working hard"),

If the Chinese score is greater than 80, return "Excellent", otherwise if it is greater than 60, return "Good", otherwise return "Keep working hard".

### ABS

用法：`ABS(num)`

 * `num:number` value
Returns the absolute value of the passed number.

### MAX

用法：`MAX(num1, num2, ...numN) or MAX([num1, num2, ...numN])`

 * `num:...number` value
Get the maximum value. If there is only one parameter and it is an array, calculate the value in the array.

### MIN

用法：`MIN(num1, num2, ...numN) or MIN([num1, num2, ...numN])`

 * `num:...number` value
Get the minimum value. If there is only one parameter and it is an array, calculate the value in the array.

### SUM

用法：`SUM(num1, num2, ...numN) or SUM([num1, num2, ...numN])`

 * `num:...number` value
Sum. If there is only one parameter and it is an array, calculate the value in the array.

### INT

用法：`INT(num)`

 * `num:number` value
Rounds a value down to the nearest integer.

### MOD

用法：`MOD(num, divisor)`

 * `num:number` the dividend
 * `divisor:number` divisor
Returns the remainder after dividing two numbers. The parameter number is the dividend and divisor is the divisor.

### PI

用法：`PI()`

Pi is 3.1415…

### ROUND

用法：`ROUND(num[, numDigits = 2])`

 * `num:number` the number to be processed
 * `numDigits:number` the number of decimal places, default is 2
Rounds a number to a specified number of decimal places.

### FLOOR

用法：`FLOOR(num[, numDigits=2])`

 * `num:number` the number to be processed
 * `numDigits:number` the number of decimal places, default is 2
Rounds a number down to the specified number of decimal places.

### CEIL

用法：`CEIL(num[, numDigits=2])`

 * `num:number` the number to be processed
 * `numDigits:number` the number of decimal places, default is 2
Rounds a number up to the specified number of decimal places.

### SQRT

用法：`SQRT(num)`

 * `num:number` the number to be processed
Square root, parameter number is a non-negative number

### AVG

用法：`AVG(num1, num2, ...numN) or AVG([num1, num2, ...numN])`

 * `num:...number` the number to be processed
Returns the average value of all parameters. If there is only one parameter and it is an array, calculates the value in the array.

### DEVSQ

用法：`DEVSQ(num1, num2, ...numN)`

 * `num:...number` the number to be processed
Returns the sum of the squares of the differences between the data point and the data mean point (data deviation). If there is only one parameter and it is an array, the value in the array is calculated.

### AVEDEV

用法：`AVEDEV(num1, num2, ...numN)`

 * `num:...number` the number to be processed
The average of the absolute deviations of the data points from their arithmetic mean.

### HARMEAN

用法：`HARMEAN(num1, num2, ...numN)`

 * `num:...number` the number to be processed
The harmonic mean of the data points. If there is only one parameter and it is an array, the value in the array is calculated.

### LARGE

用法：`LARGE(array, k)`

 * `nums:array` the numbers to be processed
 * `k:number` the largest number
The kth largest value in the data set.

### UPPERMONEY

用法：`UPPERMONEY(num)`

 * `num:number` the number to be processed
Convert the value to Chinese uppercase amount.

### RAND

用法：`RAND()`

Returns a uniformly distributed random real number greater than or equal to 0 and less than 1. The calculation changes every time it is triggered.

Example: `RAND()*100`,

Returns a random number between 0-100.

### LAST

用法：`LAST(array)`

 * `arr:...number` the array to be processed
Get the last data.

### POW

用法：`POW(base, exponent)`

 * `base:number` base
 * `exponent:number` exponent
Returns the exponential power of the base. The parameter base is the base and exponent is the exponent. If the parameter value is illegal, the base itself is returned. If the calculation result is illegal, NaN is returned.

### LEFT

用法：`LEFT(text, len)`

 * `text:string` the text to be processed
 * `len:number` the length to be processed
Returns a string of the specified length from the left side of the passed text.

### RIGHT

用法：`RIGHT(text, len)`

 * `text:string` the text to be processed
 * `len:number` the length to be processed
Returns a string of the specified length from the right side of the passed text.

### LEN

用法：`LEN(text)`

 * `text:string` the text to be processed
Calculate the length of the text.

### LENGTH

用法：`LENGTH(textArr)`

 * `textArr:Array<string>` the text collection to be processed
Calculate the length of all text in a text collection.

### ISEMPTY

用法：`ISEMPTY(text)`

 * `text:string` the text to be processed
Check if the text is empty.

### CONCATENATE

用法：`CONCATENATE(text1, text2, ...textN)`

 * `text:...string` text collection
Concatenate multiple incoming values ​​into text.

### CHAR

用法：`CHAR(code)`

 * `code:number` the encoding value
Returns the character corresponding to the numeric code of the computer's character set.

Example: `CHAR(97)` is equivalent to "a".

### LOWER

用法：`LOWER(text)`

 * `text:string` text
Convert the incoming text to lowercase.

### UPPER

用法：`UPPER(text)`

 * `text:string` text
Convert the incoming text to uppercase.

### UPPERFIRST

用法：`UPPERFIRST(text)`

 * `text:string` text
Convert the first letter of the incoming text to uppercase.

### PADSTART

用法：`PADSTART(text)`

 * `text:string` text
 * `num:number` target length
 * `pad:string` the text to use for padding
Pad forward to the length of the text.

Example `PADSTART("6", 2, "0")`,

Returns `06`.

### CAPITALIZE

用法：`CAPITALIZE(text)`

 * `text:string` text
Convert text to titles.

Example `CAPITALIZE("star")`,

Returns `Star`.

### ESCAPE

用法：`ESCAPE(text)`

 * `text:string` text
HTML escape the text.

Example `ESCAPE("<star>&")`,

Returns `<start>&`.

### TRUNCATE

用法：`TRUNCATE(text, 6)`

 * `text:string` text
 * `text:number` maximum length
Truncate the text length.

Example `TRUNCATE("amis.baidu.com", 6)`,

Returns `amis...`.

### BEFORELAST

用法：`BEFORELAST(text, '.')`

 * `text:string` text
 * `delimiter:string` end text
Take all the strings before a certain delimiter.

### SPLIT

用法：`SPLIT(text, ',')`

 * `text:string` text
 * `delimiter:string` text fragment
Split the text into an array based on the specified fragment.

Example: `SPLIT("a,b,c", ",")`,

Returns `["a", "b", "c"]`.

### TRIM

用法：`TRIM(text)`

 * `text:string` text
Remove leading and trailing spaces from the text.

### STRIPTAG

用法：`STRIPTAG(text)`

 * `text:string` text
Remove HTML tags from text.

Example: `STRIPTAG("<b>amis</b>")`,

Returns: `amis`.

### LINEBREAK

用法：`LINEBREAK(text)`

 * `text:string` text
Convert line breaks in strings to HTML `<br>` for simple line breaks.

Example: `LINEBREAK("\n")`,

Returns: `<br/>`.

### STARTSWITH

用法：`STARTSWITH(text, 'fragment')`

 * `text:string` text
 * `startString:string` starting text
Determines whether the string (text) starts with a specific string (startString), and returns true if it does, otherwise returns false.

### ENDSWITH

用法：`ENDSWITH(text, 'fragment')`

 * `text:string` text
 * `endString:string` end text
Determines whether the string (text) ends with a specific string (endString), and returns true if it does, otherwise returns false.

### CONTAINS

用法：`CONTAINS(text, searchText)`

 * `text:string` text
 * `searchText:string` search text
Determines whether the text in parameter 1 contains the text in parameter 2. If so, returns true; otherwise, returns false.

### REPLACE

用法：`REPLACE(text, search, replace)`

 * `text:string` the text to be processed
 * `search:string` the text to be replaced
 * `replace:string` the text to replace
Replace all text.

### SEARCH

用法：`SEARCH(text, search, 0)`

 * `text:string` the text to be processed
 * `search:string` the text to search for
 * `start:number` starting position
Search for text and return the location of the hit.

### MID

用法：`MID(text, from, len)`

 * `text:string` the text to be processed
 * `from:number` starting position
 * `len:number` processing length
Returns a specific number of characters from a text string starting at a specified position.

Example: `MID("amis.baidu.com", 6, 3)`,

Returns `aid`.

### BASENAME

用法：`BASENAME(text)`

 * `text:string` the text to be processed
Returns the file name in path.

Example: `/home/amis/a.json`,

Returns: `a.json`.

### UUID

用法：`UUID(8)`

 * `length:number` the length of the generated UUID string, default is 32 bits
Generate UUID string

### DATE

用法：`DATE('2021-12-06 08:20:00')`

Create a date object, either by a string in a specific format or by a numeric value.

Note that the month value starts from 0.
That is, if it is December, you should pass in the value 11.

### TIMESTAMP

用法：`TIMESTAMP(date[, format = "X"])`

Returns the timestamp of the time.

### TODAY

用法：`TODAY()`

Returns today's date.

### NOW

用法：`NOW()`

Returns the current date

### WEEKDAY

用法：`WEEKDAY(date)`

Get the day of the week for a date.

Example

WEEKDAY('2023-02-27') returns 0.
WEEKDAY('2023-02-27', 2) returns 1.

### WEEK

用法：`WEEK(date)`

Get the week of the year, that is, the number of weeks.

Example

WEEK('2023-03-05') yields 9.

### DATETOSTR

用法：`DATETOSTR(date, 'YYYY-MM-DD')`

Format dates, date strings, and timestamps.

Example

DATETOSTR('12/25/2022', 'YYYY-MM-DD') gives '2022.12.25',
DATETOSTR(1676563200, 'YYYY.MM.DD') gives '2023.02.17',
DATETOSTR(1676563200000, 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
DATETOSTR(DATE('2021-12-21'), 'YYYY.MM.DD hh:mm:ss') 得到 '2021.12.21 08:00:00'。

### DATERANGESPLIT

用法：`DATERANGESPLIT(date, 'YYYY-MM-DD')`

Get the start time and end time in the date range string.

Example:

DATERANGESPLIT('1676563200, 1676735999') gets [1676563200, 1676735999],
DATERANGESPLIT('1676563200, 1676735999', undefined , 'YYYY.MM.DD hh:mm:ss') 得到 [2023.02.17 12:00:00, 2023.02.18 11:59:59]，
DATERANGESPLIT('1676563200, 1676735999', 0 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
DATERANGESPLIT('1676563200, 1676735999', 'start' , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
DATERANGESPLIT('1676563200, 1676735999', 1 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.18 11:59:59',
DATERANGESPLIT('1676563200, 1676735999', 'end' , 'YYYY.MM.DD hh:mm:ss') gives '2023.02.18 11:59:59'.

### STARTOF

用法：``

Returns the start of a specified range of dates.

### ENDOF

用法：``

Returns the end of a specified range of dates.

### YEAR

用法：``

Returns the year of a date.

### MONTH

用法：``

Returns the month of the date, here is the natural month.

### DAY

用法：``

Returns the day of a date.

### HOUR

用法：``

 * `date:date` date object
Returns the hour of a date.

### MINUTE

用法：``

 * `date:date` date object
Returns the minute of a date.

### SECOND

用法：``

 * `date:date` date object
Returns the seconds of a date.

### YEARS

用法：``

 * `endDate:date` date object
 * `startDate:date` date object
Returns the number of years between two dates.

### MINUTES

用法：``

 * `endDate:date` date object
 * `startDate:date` date object
Returns the number of minutes between two dates.

### DAYS

用法：``

 * `endDate:date` date object
 * `startDate:date` date object
Returns the number of days between two dates.

### HOURS

用法：``

 * `endDate:date` date object
 * `startDate:date` date object
Returns the number of hours between two dates.

### DATEMODIFY

用法：``

 * `date:date` date object
 * `num:number` value
 * `unit:string` : supports year, month, day, etc.
Modify the date by adding or subtracting days, months, years, etc.

Example:

DATEMODIFY(A, -2, 'month')，

Subtract 2 months from date A.

### STRTODATE

用法：``

 * `value:string` date character
 * `format:string` date format
Convert a string date into a date object. You can specify the date format.

Example: STRTODATE('2021/12/6', 'YYYY/MM/DD')

### ISBEFORE

用法：``

 * `a:date` first date
 * `b:date` second date
 * `unit:string` unit, default is 'day', that is, compare to day
Determine whether the first date is before the second date. If yes, return true; otherwise, return false.

### ISAFTER

用法：``

 * `a:date` first date
 * `b:date` second date
 * `unit:string` unit, default is 'day', that is, compare to day
Determine whether the first date is after the second date. If so, return true; otherwise, return false.

### BETWEENRANGE

用法：``

 * `date:any` first date
 * `daterange:Array<any>` date range
 * `unit:string` unit, default is 'day', that is, compare to day
 * `inclusivity:string` Inclusivity rule, default is '[]'. [ means inclusion, ( means exclusion. If the inclusive parameter is used, two indicators must be passed in, such as '()' means both the left and right ranges are excluded.
Check if the date is within the specified range, if yes, return true, otherwise return false.

Example: BETWEENRANGE('2021/12/6', ['2021/12/5','2021/12/7']).

### ISSAMEORBEFORE

用法：``

 * `a:date` first date
 * `b:date` second date
 * `unit:string` unit, default is 'day', that is, compare to day
Determines whether the first date is before or equal to the second date. If so, returns true; otherwise, returns false.

### ISSAMEORAFTER

用法：``

 * `a:date` first date
 * `b:date` second date
 * `unit:string` unit, default is 'day', that is, compare to day
Determines whether the first date is after or equal to the second date. If so, returns true; otherwise, returns false.

## array

### COUNT

用法：`COUNT(arr)`

 * `arr:Array<any>` array

返回：`number` result

Returns the length of the array.

### ARRAYMAP

用法：`ARRAYMAP(arr, item => item)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`Array<any>` returns the converted array

Arrays need to be used with arrow functions for data conversion. Note that arrow functions only support single expression usage.

Convert each element in the array to the value returned by the arrow function.

Example:

ARRAYMAP([1, 2, 3], item => item + 1) gives [2, 3, 4].

### ARRAYFILTER

用法：`ARRAYFILTER(arr, item => item)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`Array<any>` returns the filtered array

To filter data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
Filter out members whose second arrow function returns false.

Example:

ARRAYFILTER([1, 2, 3], item => item > 1) yields [2, 3].

### ARRAYFINDINDEX

用法：`ARRAYFINDINDEX(arr, item => item === 2)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`number` result

To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
Find the index of the member for which the second arrow function returns true.

Example:

ARRAYFINDINDEX([0, 2, false], item => item === 2) returns 1.

### ARRAYFIND

用法：`ARRAYFIND(arr, item => item === 2)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`any` result

To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
Find the member whose second arrow function returns true.

Example:

ARRAYFIND([0, 2, false], item => item === 2) gets 2.

### ARRAYSOME

用法：`ARRAYSOME(arr, item => item === 2)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`boolean` result

To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
Determine whether the second arrow function has a member that returns true. If so, return true; otherwise, return false.

Example:

ARRAYSOME([0, 2, false], item => item === 2) returns true.

### ARRAYEVERY

用法：`ARRAYEVERY(arr, item => item === 2)`

 * `arr:Array<any>` array
 * `iterator:Array<any>` arrow function

返回：`boolean` result

To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
Determine whether the second arrow function returns true. If so, return true; otherwise, return false.

Example:

ARRAYEVERY([0, 2, false], item => item === 2) returns false

### ARRAYINCLUDES

用法：`ARRAYINCLUDES(arr, 2)`

 * `arr:Array<any>` array
 * `item:any` element

返回：`any` result

Determine whether the specified element exists in the data.

Example:

ARRAYINCLUDES([0, 2, false], 2) returns true.

### COMPACT

用法：`COMPACT(arr)`

 * `arr:Array<any>` array

返回：`Array<any>` result

The array filters out false, null, 0 and "".

Example:

COMPACT([0, 1, false, 2, '', 3]) yields [1, 2, 3].

### JOIN

用法：`JOIN(arr, string)`

 * `arr:Array<any>` array
 * `separator:String` separator

返回：`string` result

Convert array to string.

Example:

JOIN(['a', 'b', 'c'], '=') results in 'a=b=c'.

### CONCAT

用法：`CONCAT(['a', 'b', 'c'], ['1'], ['3'])`

 * `arr:Array<any>` array

返回：`Array<any>` result

Array merging.

Example:

CONCAT(['a', 'b', 'c'], ['1'], ['3']) gives ['a', 'b', 'c', '1', '3'].

### UNIQ

用法：`UNIQ([{a: '1'}, {b: '2'}, {a: '1'}], 'x')`

 * `arr:Array<any>` array
 * `field:string` field

返回：`Array<any>` result

Array deduplication, the second parameter "field" can specify the field to be deduplicated.

Example:

UNIQ([{a: '1'}, {b: '2'}, {a: '1'}]) gets [{a: '1'}, {b: '2'}].

## encoding

### ENCODEJSON

用法：`ENCODEJSON({name: 'amis'})`

 * `obj:object` JS object

返回：`string` result

Convert a JS object to a JSON string.

Example:

ENCODEJSON({name: 'amis'}) returns '{"name":"amis"}'.

### DECODEJSON

用法：`DECODEJSON('{\"name\": "amis"}')`

 * `str:string` string

返回：`object` result

Parse JSON encoded data and return a JS object.

Example:

DECODEJSON('{\"name\": "amis"}') gets {name: 'amis'}.

## other

### GET

用法：`GET(arr, 2)`

 * `obj:any` object or array
 * `path:string` path
 * `defaultValue:any` If the value cannot be parsed, the default value will be returned

返回：`any` result

Get the value according to the path of the object or array. If the parsed value is undefined, it will be replaced by defaultValue.

Example:

GET([0, 2, {name: 'amis', age: 18}], 1) gets 2,
GET([0, 2, {name: 'amis', age: 18}], '2.name') gets 'amis',
GET({arr: [{name: 'amis', age: 18}]}, 'arr[0].name') 得到 'amis'，
GET({arr: [{name: 'amis', age: 18}]}, 'arr.0.name') 得到 'amis'，
GET({arr: [{name: 'amis', age: 18}]}, 'arr.1.name', 'not-found') 得到 'not-found'。

### ISTYPE

用法：`ISTYPE([{a: '1'}, {b: '2'}, {a: '1'}], 'array')`

 * `judgment:string` object

返回：`boolean` result

Check whether the type is supported: string, number, array, date, plain-object.

