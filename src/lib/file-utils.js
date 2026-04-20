export const downloadJSON = (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${__filename.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    console.log("Presentation exported successfully");
  } catch (error) {
    console.error("Error exporting presentation:", error);
    alert("Failed to export presentation. Please try again.");
  }
};

export const uploadJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }

        const data = JSON.parse(event.target.result);

        // Validate the data structure
        if (!data.title || !Array.isArray(data.slides)) {
          throw new Error("Invalid presentation format");
        }

        console.log("Presentation imported successfully");
        resolve(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error);
    };

    reader.readAsText(file);
  });
};
