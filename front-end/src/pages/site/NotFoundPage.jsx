import { useEffect } from "react";

export default function NotFoundPage() {
  const NOT_FOUND_TITLE = "404 Not Found";

  useEffect(() => {
    document.title = NOT_FOUND_TITLE;
  }, []);

  return (
    <div className="flex justify-center">
      <h1>404 Not Found</h1>
    </div>
  );
}
