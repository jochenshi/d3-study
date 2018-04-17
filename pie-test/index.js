let pieInfo = {
    width: 250,
    height: 250
}

let test = [
    {name: "name1", value: 100},
    {name: "name2", value: 200},
    {name: "name3", value: 400}
];

let pieChart = (element) => {
    let pie = d3.select(element);
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let pieGenerator = d3.pie()
        .sort(null)
        .value((d) => {
            return d.value
        });
    let aa = pieGenerator(test);
    console.log(aa);
    let pieG = pie.selectAll("g")
        .data(aa)
        .enter()
        .append("g")
        .attr("transform", "translate(200, 200)");
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(120);
    
    pieG.append("path")
        .attr("fill", (d, i) => {
            return color(i)
        })
        .attr("d", (d) => {
            return arc(d)
        })
        .style("stroke", "#fff");
    pieG.append("text")
        .attr("transform", (d) => {
            return "translate(" + arc.centroid(d) + ")"
        })
        .attr("text-anchor", "middle")
        .text((d) => {
            return d.value
        })
}

pieChart("#chart")