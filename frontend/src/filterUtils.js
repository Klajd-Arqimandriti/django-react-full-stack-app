import axios from "axios";

export const handleFilterChange = (e, filters, setFilters) => {
    const { name, value } = e.target;
    setFilters({
        ...filters,
        [name]: value,
    });
};


export const handleInteractiveSheetFilterChange = (e, key, selectedColumns, setSelectedColumns) => {
    const { value } = e.target;
    setSelectedColumns({
        ...selectedColumns,
        [key]: value,
    });
};


export const handleFilterSubmit = async (e, filters, setTires, url) => {
    e.preventDefault();
    try {
        const response = await axios.get(url, {
            params: filters,
        });

        if (response.data && response.data.length > 0) {
            setTires(response.data);
        } else {
            setTires([]);
        }

        console.log('Operation successful');
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
}