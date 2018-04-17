let margin = {top: 20, right: 30, bottom: 30, left: 40},
width = 660 - margin.right - margin.left, height = 500 - margin.top - margin.bottom;
let x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.2);
let y = d3.scaleLinear().range([height ,0]);
let chart1 = d3.select('.chart1')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");



d3.json('test.json', (data) =>  {
    console.log(data);
    x.domain(data.value.map((d) => {
        return d.text
    }));
    y.domain([0, d3.max(data.value, (d) => {
        return d.value
    })]);
    let xAxis = d3.axisBottom().scale(x)
    let yAxis = d3.axisLeft().scale(y);

    chart1.append("g")
        .attr('class', 'x axis')
        .attr("transform", "translate(" + margin.left + ',' + (height + margin.top) + ")")
        .call(xAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Frequency');
    
    chart1.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis)

    let barWidth = width / data.value.length;
    let bar = chart1.selectAll('.bar')
        .data(data.value)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style('fill', 'steelblue')
        .attr('y', (d) => { 
            let min = y.domain()[0];
            console.log(y(min))
            return y(min)
        })
        .attr('x', (d) => { return x(d.text) })
        .attr('width',  x.bandwidth())
        .attr('height', () => { return 0});
    
    bar.transition()
        .duration(1000)
        .attr('y', (d) => {console.log(y(d.value));return y(d.value)})
        .attr('height', (d) => { return height - y(d.value)});
    bar.on('mouseover', (d, i,e) => {
        console.log(event.target)
        d3.select(event.target)
            .transition()
            .style('fill', 'yellow')
    });
    bar.on('mouseout', (d, i,e) => {
        console.log(event.target)
        d3.select(event.target)
            .transition()
            .style('fill', 'steelblue')
    });
        //.attr('height', (d) => { return height - y(d.value)})
        //.attr('transform', (d, i) => { return 'translate(' + x(d.text) + ',0)'});
    
    // bar.append('rect')
    //     .attr('y', (d) => { return y(d.value)})
    //     .attr('x', (d) => { return x(d.text) })
    //     .attr('height', (d) => { return height - y(d.value)})
    //     .attr('width',  x.bandwidth());
    
    // bar.append('text')
    //     .attr('x', x.bandwidth() / 2)
    //     .attr('y', (d) => { return y(d.value) + 10})
    //     .attr('dy', '.35em')
    //     .text((d) => { return d.value })
})