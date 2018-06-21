class LineChart{
    constructor(element, configs = {}) {
        let defaultConfig = {
            width: 500,
            height: 400,
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 30
            }
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.container = d3.select(element).append("svg")
            .style("width", this.config.width)
            .style("height", this.config.height);
        this.initParams();
        this.draw();
    }

    initParams() {
        this.data = [
            [
                {
                    x: 'A',
                    y: '10'
                },
                {
                    x: 'B',
                    y: '15'
                },
                {
                    x: 'C',
                    y: '25'
                },
                {
                    x: 'D',
                    y: '5'
                },
                {
                    x: 'E',
                    y: '20'
                },
                {
                    x: 'F',
                    y: '30'
                },
                {
                    x: 'G',
                    y: '6'
                }
            ],
            [
                {
                    x: 'A',
                    y: '20'
                },
                {
                    x: 'B',
                    y: '25'
                },
                {
                    x: 'C',
                    y: '35'
                },
                {
                    x: 'D',
                    y: '15'
                },
                {
                    x: 'E',
                    y: '10'
                },
                {
                    x: 'F',
                    y: '20'
                },
                {
                    x: 'G',
                    y: '46'
                }
            ]
        ];
        this.width = this.config.width - this.config.margin.right - this.config.margin.left;
        this.height = this.config.height - this.config.margin.top - this.config.margin.bottom;
    }

    //生成clippath的相关的方法
    generateDefs() {
        this.defs = this.element.append("defs")
            .append("clipPath")
            .attr("id", "line-clip")
            .append("rect")
            .attr("x", 0)
            .attr("width", this.width)
            .attr("height", this.height)
    }

    generateRange() {
        let max = 1.1 * d3.max(this.data[0], d => +d.y);

        this.xRange = d3.scaleBand().domain(this.data[0].map(d => d.x))
            .rangeRound([0, this.width]);

        this.yRange = d3.scaleLinear().domain([0, max]).range([this.height, 0]).nice()
    }

    generateContainer() {
        this.element = this.container
            .append("g")
            .attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top + ")");

        this.chartContainer = this.element.append("g")
            .attr("class", "chartContainer");

    }

    generateAxisContainer() {
        this.axisContainer = this.element.append("g")
            .attr("class", "axis");

        this.xAxisContainer= this.axisContainer.append("g")
            .attr("class", "axisX")
            .attr("transform", "translate(0 ," + this.height + ")");


        this.yAxisContainer = this.axisContainer.append("g")
            .attr("class", "axisY");

        this.axisX = this.xAxisContainer.call(d3.axisBottom(this.xRange));
        this.axisY = this.yAxisContainer.call(d3.axisLeft(this.yRange));
    }

    //绘制折现的路径的方法
    generateLine() {
        let line = d3.line()
            .curve(d3.curveCatmullRom)
            .x(d => {
                console.log(d);
                console.log(this.xRange.bandwidth(), this.xRange(d.x));
                return (this.xRange(d.x) + this.xRange.bandwidth()/2)
            })
            .y(d => {
                return this.yRange(d.y)
            });

        return line
    }

    drawLine() {
        console.log(this.data);
        let allGroup = this.chartContainer.selectAll(".group")
            .data(this.data);

        let newGroup = allGroup.enter()
            .append("g")
            .attr("class", "group");

        allGroup.transition()
            .duration(2000)
            .style("clip-path", "url(#line-clip)")
            .select("path");
            //.attr("path", d => this.drawLine()(d));

        newGroup.append("clipPath")
            .attr("class", "clippath")
            .attr("id", (d, i) => {
                return "clippath" + i
            })
            .append("rect")
            .attr("width", 0)
            .attr("height", this.height);

        newGroup.append("path")
            .style("clip-path", (d, i) => {
                return "url(#clippath" + i + ")"
            })
            .attr("stroke", "#000")
            .attr("fill", "none")
            .attr("d", d => {
                console.log(d);
                return this.generateLine()(d)
            });

        let newTrans = newGroup.transition()
            .duration(2000);

        newTrans.select(".clippath")
            .remove()
            .select("rect")
            .attr("width", this.width);

        newTrans.select("path")
            .on("end", (d, i, tar) => {
                tar.map(val => {
                    d3.select(val).style("clip-path","url(#line-clip)")
                });

            })

    }

    draw() {
        this.generateContainer();
        this.generateDefs();
        this.generateRange();
        this.generateAxisContainer();
        this.drawLine();
        /*setTimeout(() => {
            this.defs.attr("width", 0)
                .transition()
                .duration(2000)
                .attr("width", this.width)
        }, 3000)*/
    }
}