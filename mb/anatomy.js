dc.anatomyDiagram = function(parent, chartGroup) {
    const _anteriorFile = "mb/anterior.svg";
    const _posteriorFile = "mb/posterior.svg";
    let _chart = dc.marginMixin(dc.colorMixin(dc.baseMixin({})));
    let _diagramFile = _anteriorFile;
    let _tipSelector = ".tip";

	_chart.diagramFile = function(_) {
		if (!arguments.length) return _diagramFile;
		_diagramFile = _;
		return _chart;
	};

    _chart.tip = function(selector) {
        if (!arguments.length) {
            return _tipSelector;
        }
        _tipSelector = selector;
        return _chart;
    };

    _chart.anterior = function(_) {
         _diagramFile = _anteriorFile;
        return _chart;
    }

    _chart.posterior = function(_) {
         _diagramFile = _posteriorFile;
        return _chart;
    }

    _chart.resetSvg = function() {
        return _chart.svg();
    };

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    _chart._doRender = function() {

        if (!_chart.svg()) {
            generateSvg(fillDiagram);
            return;
        } else {
            fillDiagram();
        }
        return _chart;
    };

    _chart.width = function(width) {
        if (!arguments.length) {
            return undefined;
        }
        return _chart;
    };

    _chart.height = function(height) {
        if (!arguments.length) {
            return undefined;
        }
        return _chart;
    };

    _chart.colorAccessor(function (d) {
        return getValue(d);
    });

    function getValue(d) {
        return _chart.valueAccessor()(d);
    }

    function fill(d, i) {
        return _chart.getColor(d, i);
    }

    function fillDiagram() {

        var div = d3.select("body").append("div")	
            .attr("class", "tooltip tooltip-bottom");

        function highlightSlice (i, whether) {
            _chart.select('g.pie-slice._' + i)
                .classed('highlight', whether);
        }

        _chart.svg()
            .selectAll("path")
            .filter(".muscle")
            .data(_chart.data(), function(d) { return (d && d.key) || d3.select(this).attr("id"); })
            .on("mouseover", function (d) {
                d3.select(this)
                    .classed("highlight", true);
                d3.select(_tipSelector)
                    .attr("hidden", null)
                    .html(_chart.title()(d));
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .classed("highlight", false);
                d3.select(_tipSelector)
                    .attr("hidden", "true")
                    .text(null);
            })
            .attr("fill", fill)
            .exit().attr("fill", "#fefefe");
    }

    function generateSvg(completion) {
        d3.xml(_diagramFile).mimeType("image/svg+xml").get(function(error, xml) {
			if (error) {
                throw new Error(error);
            }
            let node = _chart.root().node().appendChild(xml.documentElement);
            _chart.svg(d3.select(node));
            completion();
		});
        return _chart.svg();
    }

    return _chart.anchor(parent, chartGroup);
};
