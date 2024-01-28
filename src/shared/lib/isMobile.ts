import { useState, useEffect } from "react";

function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 600);

      const handleResize = () => {
        setIsMobile(window.innerWidth <= 600);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return isMobile;
}

export default useWindowSize;
