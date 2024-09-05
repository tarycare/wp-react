import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// <TableRow>
// <TableHead className="hidden w-[100px] sm:table-cell">
//   <span className="sr-only">
//       {t("Product Image")}
//   </span>
// </TableHead>
// <TableHead>
//   {t("Product Name")}
// </TableHead>
// <TableHead>
//   {t("Status")}
// </TableHead>
// <TableHead className="hidden md:table-cell">
//   {t("Price")}
// </TableHead>
// <TableHead className="hidden md:table-cell">
//   {t("Inventory")}
// </TableHead>
// <TableHead className="hidden md:table-cell">
//   {t("Last Updated")}
// </TableHead>
// <TableHead>
//   <span className="sr-only">
//       {t("Actions")}
//   </span>
// </TableHead>
// </TableRow>
const resources = {
  en: {
    translation: {
      "product desc": "This is a product description",
      Products: "Products",
      Image: "Image",
      "Product Name": "Product Name",
      Status: "Status",
      Price: "Price",
      Inventory: "Inventory",
      "Last Updated": "Last Updated",
      Actions: "Actions",
      Draft: "Draft",
      Active: "Active",
    },
  },
  ar: {
    translation: {
      "product desc": "هذا وصف المنتج",
      Products: "منتجات",
      Image: "الصورة",
      "Product Name": "اسم المنتج",
      Status: "الحالة",
      Price: "السعر",
      Inventory: "المخزون",
      "Last Updated": "آخر تحديث",
      Actions: "الإجراءات",
      Draft: "مسودة",
      Active: "نشط",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
