import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data, width = 300, height = 150, title = "Chart", showTitle = false }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    data.forEach(d => {
      if (typeof d.count !== "number" || isNaN(d.count)) {
        console.warn(`Invalid data detected:`, d);
        d.count = 0;
      }
    });

    const totalWithoutTotal = d3.sum(data.filter(d => d.name !== "Totalt"), d => d.count);

    data.forEach(d => {
      d.percentage = totalWithoutTotal > 0 ? (d.count / totalWithoutTotal) * 100 : 0;
    });

    const margin = { top: 50, right: 230, bottom: 30, left: 30 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "transparent")  // Set background to transparent
    .style("overflow", "visible")
    .style("font-family", "inherit");
  

    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)]).nice()
      .range([chartHeight, 0]);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-chartWidth).tickFormat(""))
      .selectAll("line")
      .style("stroke", "#ddd");

    g.selectAll(".grid path").remove();

    const defs = svg.append("defs");
    const createGradient = (id, color) => {
      const gradient = defs.append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%").attr("y1", "100%")
        .attr("x2", "0%").attr("y2", "0%");

      gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.1);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 1);
    };

    createGradient("gradBusiness", "#6C8EBF");
    createGradient("gradPrivate", "#F28C8C");
    createGradient("gradTotalt", "#7DC77D");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "10px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "5px")
      .style("opacity", 0);

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("y", chartHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", d => {
        if (d.name.includes("Företagskonton")) return "url(#gradBusiness)";
        if (d.name.includes("Privatkonton")) return "url(#gradPrivate)";
        return "url(#gradTotalt)";
      })
      .attr("rx", "8px")  
      .attr("ry", "8px")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
        tooltip.style("opacity", 1);
        tooltip.html(`${d.name}: ${Math.round(d.percentage)}%`);
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 35}px`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("y", d => y(d.count))
      .attr("height", d => chartHeight - y(d.count));

    g.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", chartHeight)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay(300)
      .style("opacity", 1)
      .tween("text", function (d) {
        const interpolate = d3.interpolateNumber(0, d.count);
        return function (t) {
          this.textContent = Math.round(interpolate(t));
        };
      })
      .attr("y", d => y(d.count) - 10);

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll(".tick text")
      .remove();

    // Legend Placement (aligned properly)
    const legend = svg.append("g")
    .attr("transform", `translate(${chartWidth + margin.left + 40}, ${margin.top + 50})`); // Change 10 → 40
  

    data.forEach((d, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 25)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", () => {
          if (d.name.includes("Företagskonton")) return "#6C8EBF";
          if (d.name.includes("Privatkonton")) return "#F28C8C";
          return "#7DC77D";
        });

      legend.append("text")
        .attr("x", 20)
        .attr("y", i * 25 + 12)
        .style("font-size", "14px")
        .style("fill", "#333")
        .text(`${d.name} (${Math.round(d.percentage)}%)`);
    });

  }, [data, width, height]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {showTitle && <h3>{title}</h3>}
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default BarChart;
