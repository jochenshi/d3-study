class RadarChart {
    constructor(id, configs = {}) {
        let defaultConfig = {
            width: 400,
            height: 400,
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            level: 3,
            maxValue: 50,
            labelFactor: 1.05,
            strokeWidth: 2
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.generateContainer(id);
        this.initParams();
        this.generateAxis();
        this.generateRadar();
        this.addEvents();
    }

    generateContainer(id) {
        this.svg = d3.select(id)
            .append("svg")
            .attr("width", this.config.width + this.config.margin.right + this.config.margin.left)
            .attr("height", this.config.height + this.config.margin.top + this.config.margin.bottom);

        this.radius = Math.min(this.config.width / 2, this.config.height / 2);

        this.mainContent = this.svg.append("g")
            .attr("transform", "translate(" + (this.config.width / 2 + this.config.margin.left) + "," + (this.config.height / 2 + this.config.margin.top) + ")");

        this.axisGrid = this.mainContent.append("g")
            .attr("class", "axisWrapper");
    }

    initParams() {
        let test = [
            [
                {axis: "A", value: 10},
                {axis: "B", value: 20},
                {axis: "C", value: 30},
                {axis: "D", value: 40}
            ],
            [
                {axis: "A", value: 16},
                {axis: "B", value: 35},
                {axis: "C", value: 40},
                {axis: "D", value: 10}
            ]
        ];
        this.data = test;
        this.allAxis = test[0].map((val) => {
            return val["axis"]
        });

        this.total = this.allAxis.length;
        this.angleSlice = Math.PI * 2 / this.total;
        this.maxValue = Math.max(this.config.maxValue, d3.max(this.data, (d) => {
            return d3.max(d, (i) => {
                return i["value"]
            });
        }));
        this.rScale = d3.scaleLinear()
            .range([0, this.radius])
            .domain([0, this.maxValue]);

        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    }

    initData() {
        let test = [
            {axis: "A", value: 10},
            {axis: "B", value: 20},
            {axis: "C", value: 30},
            {axis: "D", value: 15}
        ];
    }

    generateAxis() {
        this.axisGrid.selectAll(".levels")
            .data(d3.range(1, this.config.level + 1).reverse())
            .enter()
            .append("circle")
            .attr("class", "levels")
            .attr("r", (d) => {
                return this.radius / this.config.level * d
            })
            .attr("fill", "none")
            .attr("stroke", "#e3e3e3");

        this.axis = this.axisGrid.selectAll(".axis")
            .data(this.allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        this.axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => {
                return this.rScale(this.maxValue * 1.1) * Math.sin(this.angleSlice * i)
            })
            .attr("y2", (d, i) => {
                return this.rScale(this.maxValue * 1.1) * Math.cos(this.angleSlice * i) * (-1)
            })
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        this.axis.append("text")
            .attr("x", (d, i) => {
                return this.rScale(this.maxValue * this.config.labelFactor) * Math.sin(this.angleSlice * i)
            })
            .attr("y", (d, i) => {
                return this.rScale(this.maxValue * this.config.labelFactor) * Math.cos(this.angleSlice * i) * (-1)
            })
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", 10)
            .text((d) => {
                return d
            });


    }

    //生成每一条数据的线
    generateRadar() {
        this.radarLine = d3.lineRadial()
            .radius((d) => {
                return this.rScale(d.value)
            })
            .angle((d, i) => {
                return this.angleSlice * i
            })
            .curve(d3.curveCatmullRomClosed);

        this.radarWrapper = this.mainContent.selectAll(".radarWrapper")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "radarWrapper");

        //set the background of each radar area
        this.radarArea = this.radarWrapper.append("path")
            .attr("class", "radarArea")
            .attr("d", (d) => {
                return this.radarLine(d)
            })
            .attr("fill", (d, i) => {
                return this.colors(i)
            })
            .attr("fill-opacity", 0.35);

        this.radarWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", (d) => {
                return this.radarLine(d)
            })
            .style("fill", "none")
            .style("stroke", (d, i) => {
                return this.colors(i)
            })
            .attr("stroke-width", this.config.strokeWidth + "px");

        this.radarWrapper.selectAll(".radarCircle")
            .data((d, i) => {
                return d
            })
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", 3)
            .attr("cx", (d, i) => {
                return this.rScale(d.value) * Math.sin(this.angleSlice*i)
            })
            .attr("cy", (d, i) => {
                return this.rScale(d.value) * Math.cos(this.angleSlice * i) * (-1)
            })
    }

    addEvents() {
        this.radarArea.on("mouseover", (d, i) => {
            d3.selectAll(".radarArea")
                .transition()
                .duration(200)
                .attr("fill-opacity", 0.1);
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("fill-opacity", 0.7);
        })
            .on("mouseout", (d, i) => {
                d3.selectAll(".radarArea")
                    .transition()
                    .duration(200)
                    .attr("fill-opacity", 0.35)
            })
    }
}