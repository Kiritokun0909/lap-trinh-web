import React, { useEffect } from "react";
import { testAdmin } from "../../api/authApi";

export default function ManageMangaPage() {
  useEffect(() => {
    const testFetch = async () => {
      const data = await testAdmin();
      console.log(">>> data: ", data);
    };

    testFetch();
  }, []);

  return (
    <>
      <h1>Quan ly danh sach manga</h1>
    </>
  );
}
