class GroupBar {
    constructor (element, configs) {
        this.ele = d3.select(element);
        let defaultConfig = {
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            }
        };
        this.config = Object.assign({}, defaultConfig, configs);
        this.initParams();
        this.handleData();
    }

    initParams () {
        this.width = 500 - this.config.margin.left - this.config.margin.right;
        this.height = 390 - this.config.margin.top - this.config.margin.bottom;
        this.initAxis();
    }

    //初始化坐标轴
    initAxis () {
        //主横坐标
        this.x0 = d3.scaleBand().rangeRound([0, this.width]).paddingInner(0.1);
        //具体的细分的单个部分
        this.x1 = d3.scaleBand().padding(0.1);
        this.y = d3.scaleLinear().range([this.height, 0]);
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
    }

    generateMainContent () {
        this.mainContent = this.ele.append("g")
            .attr("transform", "translate(" + this.config.margin.left + "," + this.config.margin.top + ")");
        this.mainContent.append("g")
            .selectAll("g")
            .data(this.data)
            .enter()
            .append("g")
            .attr("transform", (d) => {
                return "translate(" + this.x0(d.State) + ", 0)"
            })
            .selectAll("rect")
            .data((d) => {
                return this.keys.map((k) => {
                    return {key: k, value: d[k]}
                })
            })
            .enter()
            .append("rect")
            .attr("x", (d) => { return this.x1(d.key)})
            .attr("y", (d) => { return this.y(d.value)})
            .attr("width", this.x1.bandwidth())
            .attr("height", (d) => { return this.height - this.y(d.value)})
            .attr("fill", (d, i) => { return this.color(i)});

        this.mainContent.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0 ," + this.height + ")")
            .call(d3.axisBottom(this.x0));

        this.mainContent.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(this.y).ticks(null, "s"))
    }

    _render (data) {
        this.generateMainContent(data)
    }

    //读取文件的数据，并进行相应的处理
    handleData () {
        let that = this;
        d3.csv('data.csv', (d, i, column) => {
            //init function change the data in d to type number
            for (let i = 1; i < column.length; i++) {
                d[column[i]] = +d[column[i]]
            }
            return d
        }, (error, data) => {
            let keys = data.columns.slice(1);
            this.x0.domain(data.map((d) => {
                return d.State;
            }));
            this.x1.domain(keys).rangeRound([0, this.x0.bandwidth()]);

            //计算出y轴的范围
            this.y.domain([0, d3.max(data, (d) => {
                return d3.max(keys, (k) => {
                    return d[k]
                })
            })]);
            this.data = data;
            this.keys = keys;
            this.generateMainContent();
        })
    }
}