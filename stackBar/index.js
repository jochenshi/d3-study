class StackBar {
    constructor (element, configs) {
        this.ele = d3.select(element);
        this.defaultConfig = {
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 30
            },
            barWidth: 25,
            showLegend: true
        };
        this.config = Object.assign({}, this.defaultConfig, configs);
        this.initParams();
        this.generateMainContent();
        this.setLegend();
    }

    //传入的数据更新时的处理
    update (data) {
        data = [
            {name: "A", "tim": 20, "nancy": 10},
            {name: "B", "tom": 22, "tim": 10, "nancy": 30},
            {name: "C", "tom": 32, "tim": 10, "nancy": 11},
            {name: "D", "tom": 22, "tim": 10, "nancy": 21},
        ];
        this.handleData(data);
        this.initAxis();
        this.updateAxis();
        this.draw();

    }

    _updateAxisX () {

    }

    handleData (data) {
        if (!data) {
            console.log("get no data");
            return
        } else {
            let aKeys = [], legends = [];
            for (let i = 0; i < data.length; i++) {
                aKeys.push(data[i].name);
                for (let j in data[i]) {
                    if (j !== "name") {
                        legends.push(j)
                    }
                }
            }
            this.legends = Array.from(new Set(legends));
            this.keys = aKeys;
            this.data = d3.stack().keys(this.legends)(data);
        }
    }

    initParams () {
        this.width = 600 - this.config.margin.left - this.config.margin.right;
        this.height = 500 - this.config.margin.top - this.config.margin.bottom;
        let inData = [
            {name: "A", "tim": 20, "nancy": 10},
            {name: "B", "tom": 22, "tim": 10, "nancy": 30},
            {name: "C", "tom": 32, "tim": 10, "nancy": 11},
            {name: "D", "tom": 22, "tim": 10, "nancy": 21},
            {name: "E", "tom": 22, "tim": 10, "nancy": 33}
        ];
        this.handleData(inData);
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
        this.initAxis();

    }

    initAxis () {
        this.yAxis = d3.scaleLinear().range([this.height, 0])
            .domain([0, d3.max(this.data, (d) => {
                return d3.max(d, (d) => {
                    return d[1]
                });
            })]).nice();
        this.xAxis = d3.scaleBand().rangeRound([0, this.width])
            .domain(this.keys).padding(0.1);

        if (this.xAxis.bandwidth() < this.config.barWidth) {
            this.config.barWidth = this.xAxis.bandwidth();
        }
    }

    updateAxis () {
        this.x.call(d3.axisBottom(this.xAxis));
        this.y.call(d3.axisLeft(this.yAxis))
    }

    setAxis () {
        this.y = this.mainContent.append("g")
            .attr("class", "axis yAxis")
            .call(d3.axisLeft(this.yAxis));

        this.x = this.mainContent.append("g")
            .attr("class", "axis xAxis")
            .attr("transform", "translate(0, " + (this.height) + ")")
            .call(d3.axisBottom(this.xAxis))
    }

    setLegend () {
        this.legendArea = this.mainContent.append("g")
            .selectAll("g")
            .data(this.legends)
            .enter()
            .append("g")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .attr("transform", (d, i) => {
                return "translate(0," + i*20 + ")"
            });

        this.legendArea.append("text")
            .text((d) => {
                return d
            })
            .attr("x", this.width - 25)
            .attr("y", 9.5)
            .attr("dy", "0.32em");

        this.legendArea.append("rect")
            .attr("x", this.width - 19)
            .attr("width", 19)
            .attr("height", 17)
            .attr("fill", (d, i) => {
                return this.color(i)
            })

    }

    draw () {
        //每一种颜色的区域
        let gArea = this.mainContent.selectAll(".sGroups")
            .data(this.data);

        //新增的g
        let enArea = gArea.enter()
            .append("g")
            .attr("class", "sGroups")
            .attr("fill", (d, i) => { return this.color(this.legends.indexOf(d.key))});

        let inRect = gArea.selectAll(".bar_rect")
            .data((d) => {
                console.log(d);
                return d
            });
        let newRect = inRect.enter()
            .append("rect")
            .attr("class", "bar_rect");

        newRect.attr("x", (d) => {
            return (this.xAxis(d.data.name) + this.xAxis.bandwidth()/2 - this.config.barWidth/2)
            })
            .attr("y", (d) => {
                return this.height
            })
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("y", (d) => {
                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[1])
                }
            })
            .attr("height", (d, i, data) => {
                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[0]) - this.yAxis(d[1])
                }
            });

        gArea.exit().remove();
        inRect.exit().remove();

        inRect
            .transition()
            .duration(1000)
            .attr("x", (d) => {
                return (this.xAxis(d.data.name) + this.xAxis.bandwidth()/2 - this.config.barWidth/2)
            })
            .attr("y", (d) => {

                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[1])
                }
            })
            .attr("height", (d, i, data) => {
                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[0]) - this.yAxis(d[1])
                }
            });

    }

    generateMainContent () {
        this.mainContent = this.ele.append("g")
            .attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top + ")");

        this.setAxis();

        this.sGroups = this.mainContent.append("g")
            .attr("class", "rect_wrapper")
            .selectAll("g")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "sGroups")
            .attr("fill", (d, i) => { return this.color(this.legends.indexOf(d.key))});

        this.rects = this.sGroups.selectAll("rect")
            .data((d) => {
                return d
            })
            .enter()
            .append("rect")
            .attr("class","bar_rect")
            .attr("x", (d) => {
                return (this.xAxis(d.data.name) + this.xAxis.bandwidth()/2 - this.config.barWidth/2)
            })
            .attr("y", (d) => {
                return this.yAxis(this.yAxis.domain()[0])
            })
            .transition()
            .duration(1000)
            .attr("y", (d) => {
                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[1])
                }
            })
            .attr("height", (d, i, data) => {
                if (Number.isNaN(d[1])) {
                    return 0
                } else {
                    return this.yAxis(d[0]) - this.yAxis(d[1])
                }
            })
            .attr("width", this.config.barWidth)
    }
}