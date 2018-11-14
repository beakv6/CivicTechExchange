// @flow

class Truncate {

  static stringT(str: string, length: number) {
    var dots = str.length > length ? "..." : "";
    return (str + dots).substring(0, length);
  }

  static arrayT(arr: array, length: number) {
    if (arr.length > length) {
     let result = arr.slice(0, length-1)
     result.push(arr.length - 3 + " more")
     return result;
    } else {
      return arr;
    }
  }
}

export default Truncate;
