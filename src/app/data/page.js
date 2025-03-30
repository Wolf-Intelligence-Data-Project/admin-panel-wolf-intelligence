"use client";
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const ProductsPage = () => {
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [unsoldProductsCount, setUnsoldProductsCount] = useState(0);
  const [soldProductsCount, setSoldProductsCount] = useState(0);
  const [unsoldPercentage, setUnsoldPercentage] = useState(0);
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    const fetchProductCounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products/count');
        setTotalProductsCount(response.data.totalProductsCount ?? 0);
        setUnsoldProductsCount(response.data.unsoldProductsCount ?? 0);
        setSoldProductsCount(response.data.soldProductsCount ?? 0);
        setUnsoldPercentage(response.data.unsoldPercentage ?? 0);
        setSoldPercentage(response.data.soldPercentage ?? 0);
      } catch (err) {
        setError('Ett fel uppstod vid hämtning av produktdata.');
      } finally {
        console.log(soldPercentage, unsoldPercentage);
        setLoading(false);
      }
    };

    fetchProductCounts();
  }, []);

  const data = [
    { name: 'Totalt antal rader', count: totalProductsCount },
    { name: 'Ej sålda rader', count: unsoldProductsCount },
    { name: 'Sålda rader', count: soldProductsCount },
  ];

  const formatNumber = (num) => {
    // Return full number without shortening decimals
    return num.toLocaleString();
  };
  
  const chartColors = {
    total: "#6C8EBF",   // Blue
    unsold: "#F76C6C",   // Red
    sold: "#4CAF50",     // Green
  };
  
  const barChart = () => {
    if (data.length > 0 && chartRef.current) {
      const svg = d3.select(chartRef.current)
        .attr("width", "35rem")
        .attr("height", 300)
        .style("background-color", "#f8f8f8")
        .style("overflow", "visible")
        .style("font-family", "inherit"); // Ensure font inheritance
  
      const margin = { top: 30, right: 5, bottom: 20, left: 5 };
      const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
      const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
  
      svg.selectAll("*").remove();
  
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height, 0]);
  
      g.selectAll(".grid-line")
        .data(y.ticks(5))
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .style("stroke", "#ddd")
        .style("stroke-dasharray", "2,2");
  
      // Define gradients for Total, Unsold, and Sold dynamically using chartColors
      const gradientTotal = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradTotal")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
  
      gradientTotal.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColors.total) // Use dynamic color
        .attr("stop-opacity", 0.2);
  
      gradientTotal.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors.total) // Use dynamic color
        .attr("stop-opacity", 1);
  
      const gradientUnsold = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradUnsold")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
  
      gradientUnsold.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColors.unsold) // Use dynamic color
        .attr("stop-opacity", 0.2);
  
      gradientUnsold.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors.unsold) // Use dynamic color
        .attr("stop-opacity", 1);
  
      const gradientSold = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradSold")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
  
      gradientSold.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColors.sold) // Use dynamic color
        .attr("stop-opacity", 0.2);
  
      gradientSold.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors.sold) // Use dynamic color
        .attr("stop-opacity", 1);
  
      const bars = g.append("g")
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => {
          // Apply gradients based on exact category names in data
          if (d.name === 'Totalt antal rader') return "url(#gradTotal)";
          if (d.name === 'Ej sålda rader') return "url(#gradUnsold)";
          return "url(#gradSold)";
        })
        .attr("rx", "8px")  // Apply border-radius only to the top corners
        .attr("ry", "8px")  // Apply vertical radius to top corners only
        .on("mouseover", function (event, d) {
          d3.select(this).style("opacity", 0.7);
        
  // Show tooltip with the name and the total product count
tooltip.transition().duration(200).style("opacity", .9);
tooltip.html(`${d.name}: ${formatNumber(d.count)}`)
  .style("left", `${event.pageX + 10}px`)  // Increase the left offset for more space
  .style("top", `${event.pageY - 35}px`)   // Adjust top to give a bit more space above the cursor
  .style("padding", "10px")                // Increased padding
  .style("font-size", "14px");             // Optional: Adjust font size for better readability
})
.on("mouseout", function () {
  d3.select(this).style("opacity", 1);
  tooltip.transition().duration(500).style("opacity", 0);
})
.transition()
.duration(1000)
.attr("y", d => y(d.count))
.attr("height", d => height - y(d.count));

// Add a tooltip for showing the number on hover
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "10px")  // Increased padding
  .style("background-color", "rgba(0, 0, 0, 0.7)")
  .style("color", "#fff")
  .style("border-radius", "5px")
  .style("opacity", 0)
  .style("pointer-events", "none");  // Prevent tooltip from interfering with other elements

// Tooltip follow mouse
svg.on("mousemove", function (event) {
  tooltip.style("left", `${event.pageX + 10}px`)  // Adjust left offset
    .style("top", `${event.pageY - 35}px`);       // Adjust top offset for more padding
});

      // Animate Number Count (from 0 to the final value)
      g.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(0))  // Start at the bottom (aligned with the bars)
        .attr("dy", ".75em")
        .attr("text-anchor", "middle")
        .style("font-size", "22px")  // Keep the original font size
        .style("font-weight", "bold")
        .style("fill", "#333")
        .style("opacity", 0)  // Start with opacity 0 for animation
        .transition()
        .duration(1000)  // Duration of the number count animation
        .delay(300)  // Add a 0.3s delay before the opacity starts animating
        .style("opacity", 1)  // Fade in the label
        .tween("text", function (d) {
          const interpolate = d3.interpolateNumber(0, d.count);
          return function (t) {
            this.textContent = formatNumber(Math.round(interpolate(t))); // Use formatted number
          };
        })
        .attr("y", d => y(d.count) - 30);  // Position labels slightly higher above the bars
  
      // X-axis
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll(".tick text")
        .style("font-size", "14px")
        .style("fill", "#666")
        .attr("dy", "1em");
  
      // Y-axis (remove the line and labels)
      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(5))
        .style("font-size", "14px")
        .style("fill", "#666")
        .selectAll("path, line, text")
        .remove();
    }
  };
  
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('Ingen fil vald');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/products/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      setUploadMessage(response.data.message || 'Products imported successfully.');
    } catch (error) {
      console.error('Error importing products:', error);
      setUploadMessage('An error occurred while importing products.');
    }
  };
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedUnsold, setAnimatedUnsold] = useState(0);
  const [animatedSold, setAnimatedSold] = useState(0);
  const [animatedUnsoldPercentage, setAnimatedUnsoldPercentage] = useState(0);
  const [animatedSoldPercentage, setAnimatedSoldPercentage] = useState(0);

  // Function to animate numbers from 0 to the final value
  const animateNumber = (startValue, endValue, duration = 700) => {
    let startTime = null;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;
      const currentValue = startValue + (endValue - startValue) * Math.min(progress, 1);
      return currentValue;
    };
    return animate;
  };

  useEffect(() => {
    barChart();
    // Animate the total count
    const totalAnimate = animateNumber(0, totalProductsCount);
    const unsoldAnimate = animateNumber(0, unsoldProductsCount);
    const soldAnimate = animateNumber(0, soldProductsCount);
    const unsoldPercentageAnimate = animateNumber(0, unsoldPercentage);
    const soldPercentageAnimate = animateNumber(0, soldPercentage);

    let animationFrameId;
    const animateValues = (time) => {
      setAnimatedTotal(totalAnimate(time));
      setAnimatedUnsold(unsoldAnimate(time));
      setAnimatedSold(soldAnimate(time));
      setAnimatedUnsoldPercentage(unsoldPercentageAnimate(time));
      setAnimatedSoldPercentage(soldPercentageAnimate(time));

      if (
        totalAnimate(time) < totalProductsCount || 
        unsoldAnimate(time) < unsoldProductsCount || 
        soldAnimate(time) < soldProductsCount ||
        unsoldPercentageAnimate(time) < unsoldPercentage ||
        soldPercentageAnimate(time) < soldPercentage
      ) {
        animationFrameId = requestAnimationFrame(animateValues);
      }
    };

    animationFrameId = requestAnimationFrame(animateValues);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalProductsCount, unsoldProductsCount, soldProductsCount, unsoldPercentage, soldPercentage]); // Only rerun if values change
  
   // Format the values before passing them to the JSX
   const formattedTotal = Math.round(animatedTotal);
   const formattedUnsold = Math.round(animatedUnsold);
   const formattedSold = Math.round(animatedSold);
   const formattedUnsoldPercentage = animatedUnsoldPercentage.toFixed(1);
   const formattedSoldPercentage = animatedSoldPercentage.toFixed(1);
  
  if (loading) {
    return <div>Loading product data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (loading) return <div>Laddar...</div>;
  if (error) return <div>{error}</div>;

 
return (
  <div className="data-section">
    <div className="box">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Dataöversikt</h2>
      <svg ref={chartRef}></svg>
    </div>
    <div>
    <div className="box">
      <div className='row'>
        <strong>Totalt antal företagsuppgifter:</strong>
        <h3 style={{ color: chartColors.total }}>{formattedTotal}</h3>
      </div>
      <div className='row'>
        <strong>Ej sålda företagsuppgifter:</strong>
        <h3 style={{ color: chartColors.unsold }}>{formattedUnsold}</h3>
        <h3 style={{ color: chartColors.unsold }}>({formattedUnsoldPercentage}%)</h3>
      </div>
      <div className='row'>
        <strong>Sålda företagsuppgifter:</strong>
        <h3 style={{ color: chartColors.sold }}>{formattedSold}</h3>
        <h3 style={{ color: chartColors.sold }}>({formattedSoldPercentage}%)</h3>
      </div>
    </div>
      <div className="box">
        <h3>Importera fler företag</h3>
        <form className='upload-form'>
        <label htmlFor="file-upload">Välj en Excel-fil</label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          id="file-upload"
          className="hidden-file-input"
        />
          <button
            className="button-positive"
            onClick={handleFileUpload}
            disabled={!file} // Disable button if no file is selected
          >
          Importera filen
        </button>
        </form>
        {uploadMessage && <div className="error">{uploadMessage}</div>}
      </div>
    </div>
  </div>
);
};

export default ProductsPage;
