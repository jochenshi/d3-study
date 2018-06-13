class CubeBar {
    constructor(element, configs = {}) {
        let defaultConfig = {
            barWidth: 20,
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 30
            },
            width: 500,
            height: 500
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.initParams();
        this.generateContainer(element);
        this.generateGradient();
        this.draw();
    }

    initParams() {
        let test = {
            name: "chart1",
            value: [
                {x: "A", y: 10},
                {x: "B", y: 20},
                {x: "C", y: 30},
                {x: "D", y: 15}
            ]
        };
        this.barWidth = this.config.barWidth;
        this.height = this.config.height - this.config.margin.top - this.config.margin.bottom;
        this.width = this.config.width - this.config.margin.right - this.config.margin.left;
        this.data = test;
    }

    generateGradient() {
        let linearArea = this.mainContent.append("defs")
            .append("linearGradient")
            .attr("id", "test")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 1)
            .attr("y2", 0);

        linearArea.append("stop")
            .attr("offset", 0)
            .attr("stop-color", "#F7B95E");

        linearArea.append("stop")
            .attr("offset", 1)
            .attr("stop-color", "#FA3434")
    }

    generateContainer(element) {
        this.svg = d3.select(element)
            .append("svg")
            .attr("width", this.config.width)
            .attr("height", this.config.height);

        this.mainContent = this.svg.append("g")
            .attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top + ")");

        this.barArea = this.mainContent.append("g")
            .attr("class", "barArea");
    }

    setRange() {
        this.x = d3.scaleBand()
            .rangeRound([0, this.width]);

        this.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        this.x.domain(this.data.value.map((val) => {
            return val.x;
        }));

        this.y.domain([0, d3.max(this.data.value, (val) => {
            return val.y
        })])
    }

    drawAxisX() {
        let xAxis = d3.axisBottom(this.x);
        this.xAxis = this.mainContent.append("g")
            .attr("class", "axis xAxis")
            .attr("transform", "translate(0, " + this.height + ")")
            .call(xAxis);
    }

    drawAxisY() {
        let yAxis = d3.axisLeft(this.y);
        this.yAxis = this.mainContent.append("g")
            .attr("class", "axis yAxis")
            .call(yAxis)
    }

    calculateX(d) {
        return this.x(d.x) + (this.x.bandwidth() - this.config.barWidth)/2;
    }

    //此方法为将右侧面跟顶面同时绘制的方法
    generatePath(d, flag = true) {
        let path = d3.path();
        path.moveTo(this.calculateX(d) + this.barWidth, this.height);
        path.lineTo(this.calculateX(d) + this.barWidth*(1+ Math.cos(Math.PI/3)), this.height-this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d) + this.barWidth*(1+ Math.cos(Math.PI/3)), (flag ? this.y(d.y) : this.height) -this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d) + this.barWidth*(Math.cos(Math.PI/3)), (flag ? this.y(d.y) : this.height)-this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d), (flag ? this.y(d.y) : this.height));
        path.lineTo(this.calculateX(d) + this.barWidth, (flag ? this.y(d.y) : this.height));
        path.closePath();
        return path;
    }

    //此方法为将右侧跟左侧的区域分开绘制的方法
    generateRight(d, flag = true) {
        let path = d3.path();
        path.moveTo(this.calculateX(d) + this.barWidth, this.height);
        path.lineTo(this.calculateX(d) + this.barWidth*(1+ Math.cos(Math.PI/3)), this.height-this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d) + this.barWidth*(1+ Math.cos(Math.PI/3)), (flag ? this.y(d.y) : this.height) -this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d) + this.barWidth, (flag ? this.y(d.y) : this.height));
        path.closePath();
        return path;
    }

    generateTop(d, flag = true) {
        let path = d3.path();
        path.moveTo(this.calculateX(d) + this.barWidth, (flag ? this.y(d.y) : this.height));
        path.lineTo(this.calculateX(d) + this.barWidth*(1 + Math.cos(Math.PI/3)), (flag ? this.y(d.y) : this.height) - this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d) + this.barWidth*Math.cos(Math.PI/3), (flag ? this.y(d.y) : this.height) - this.barWidth*Math.cos(Math.PI/3));
        path.lineTo(this.calculateX(d), (flag ? this.y(d.y) : this.height));
        path.closePath();
        return path;
    }

    drawBar() {
        let bar = this.barArea.selectAll(".singleBar")
            .data(this.data.value);

        let gBar = bar.enter()
            .append("g")
            .attr("class", "singleBar");

        gBar.append("rect")
            .attr("class", "bar_rect")
            .style("fill", "steelblue")
            .attr("width", this.config.barWidth)
            .attr("x", (d, i) => {
                return this.calculateX(d);
            })
            .attr("y", this.height)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("y", (d, i) => {
                return this.y(d.y)
            })
            .attr("height", (d, i) => {
                return this.height - this.y(d.y)
            });
/*
        gBar.append("path")
            .attr("class", "rightPath")
            .attr("d", (d, i) => {
                return this.generatePath(d, false)
            })
            .style("fill", "blue")
            .transition()
            .duration(1000)
            .attr("d", (d, i) => {
                return this.generatePath(d)
            });*/

        //generate two path testing
        gBar.append("path")
            .attr("class", "rightPath")
            .attr("d", (d, i) => {
                return this.generateRight(d, false)
            })
            .style("fill", "url(#test)")
            .transition()
            .duration(1000)
            .attr("d", (d, i) => {
                return this.generateRight(d)
            });

        gBar.append("path")
            .attr("class", "topPath")
            .attr("d", (d, i) => {
                return this.generateTop(d, false)
            })
            .style("fill", "blue")
            .transition()
            .duration(1000)
            .attr("d", (d, i) => {
                return this.generateTop(d)
            });
    }

    draw() {
        this.setRange();
        this.drawAxisX();
        this.drawAxisY();
        this.drawBar();
    }
}