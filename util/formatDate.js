// // Helper function to format date as DD-MM-YY
// export default function formatDate(date) {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = String(d.getFullYear()).slice(-2); // last 2 digits
//     return `${day}-${month}-${year}`;
//   }
  
const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year.slice(-2)}`;
  };
  
export default formatDate