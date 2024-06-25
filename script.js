// U32196076

document.addEventListener('DOMContentLoaded', function() {
    const stockSelect = document.getElementById('stockSelect');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const svg = d3.select("svg");
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

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

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.Price));

        const xAxis = g.append("g")
            .attr("transform", `translate(0,${height})`);

       
        const yAxis = g.append("g");

        function updateVisualization(filteredData) {
         
            x.domain(d3.extent(filteredData, d => d.Date));
            y.domain([0, d3.max(filteredData, d => d.Price)]);

            const stockLine = g.selectAll(".line")
                .data([filteredData]);

            stockLine.enter()
                .append("path")
                .attr("class", "line")
                .merge(stockLine)
                .transition()
                .duration(750)
                .attr("d", line);

            stockLine.exit().remove();

            xAxis.transition().duration(750).call(d3.axisBottom(x));
            yAxis.transition().duration(750).call(d3.axisLeft(y));
        }

        function filterData() {
            const selectedStock = stockSelect.value;
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            const filteredData = data.filter(d => 
                d.Stock === selectedStock && d.Date >= startDate && d.Date <= endDate
            );

            updateVisualization(filteredData);
        }

        stockSelect.addEventListener('change', filterData);
        startDateInput.addEventListener('change', filterData);
        endDateInput.addEventListener('change', filterData);

        stockSelect.value = stockNames[0];
        startDateInput.value = startDateInput.min;
        endDateInput.value = endDateInput.max;
        filterData();
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
});
