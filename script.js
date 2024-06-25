document.addEventListener('DOMContentLoaded', function() {
    const stockSelect = document.getElementById('stockSelect');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    d3.csv('mock_stock_data.csv').then(data => {
        data.forEach(d => {
            d.Date = new Date(d.Date);
            d.Price = +d.Price;
        });

        // for getting unique stock names
        const stockNames = [...new Set(data.map(d => d.Stock))];

        stockNames.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock;
            option.text = stock;
            stockSelect.appendChild(option);
        });

        const dates = data.map(d => d.Date);
        startDateInput.min = d3.min(dates).toISOString().split('T')[0];
        startDateInput.max = d3.max(dates).toISOString().split('T')[0];
        endDateInput.min = d3.min(dates).toISOString().split('T')[0];
        endDateInput.max = d3.max(dates).toISOString().split('T')[0];

        function filterData() {
            const selectedStock = stockSelect.value;
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            const filteredData = data.filter(d => 
                d.Stock === selectedStock && d.Date >= startDate && d.Date <= endDate
            );

            console.log(filteredData);
        }

        stockSelect.addEventListener('change', filterData);
        startDateInput.addEventListener('change', filterData);
        endDateInput.addEventListener('change', filterData);
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
});
