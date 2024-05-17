import api from "./api";

export const downloadExcel = async () => {
    const token = localStorage.getItem("access");
    const response = await api.get("/api/download_excel/", {
        headers: {
            'Content-Type': ' application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({tires: getFilteredTires()}),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'tires_data.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const downloadPDF = async () => {
    const token = localStorage.getItem("access");
    const response = await api.get("/api/download_pdf/", {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ /* Add any data needed for PDF generation */}),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'file.pdf'); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    link.remove();
};