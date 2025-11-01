import { toast } from "react-toastify";

// Background Function
export const createBackground = (theme, className = "") => {
  const bgTheme =
    theme === "light" ? " bg-white " : theme === "dark" ? " bg-black-300 " : " bg-green-300 ";

  return (
    <div className={"absolute top-0 left-0 -z-999 h-full w-full " + bgTheme + " " + className} />
  );
};

// Copy Function
export const copyContent = (content, context) => {
  // Toasters
  navigator.clipboard
    .writeText(content)
    .then(() => {
      toast.success(context + " successfully copied!");
    })
    .catch((err) => {
      toast.error("Failed to copy " + context);
    });
};

// Routing Function
export const directRoute = (link, router, pathname) => {
  // console.log("Comparing to " + link + " with current " + pathname);

  if (pathname !== link) router.push(link);
};

// Check Email
export function checkEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}
