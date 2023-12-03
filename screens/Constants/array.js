export const sortArrayByDate = (arr, key, mode = "asc") => {
    return arr.sort((a, b) => {
      const date1 = new Date(b[key]);
      const date2 = new Date(a[key]);
      if (mode === "asc") {
        return date1 - date2;
      } else {
        return date2 - date1;
      }
    });
  };