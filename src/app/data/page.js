"use client";
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductsPage = () => {
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [unsoldProductsCount, setUnsoldProductsCount] = useState(0);
  const [soldProductsCount, setSoldProductsCount] = useState(0);
  const [unsoldPercentage, setUnsoldPercentage] = useState(0);
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const chartRef = useRef(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchProductCounts = async () => {
      setLoading(true);
      try {
         const response = await axios.get('/api/products/count', {
        withCredentials: true, // Ensure cookies are sent
      });
        setTotalProductsCount(response.data.totalProductsCount ?? 0);
        setUnsoldProductsCount(response.data.unsoldProductsCount ?? 0);
        setSoldProductsCount(response.data.soldProductsCount ?? 0);
        setUnsoldPercentage(response.data.unsoldPercentage ?? 0);
        setSoldPercentage(response.data.soldPercentage ?? 0);
      } catch (err) {
        setError('Ett fel uppstod vid hämtning av produktdata.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductCounts();
  }, []);

  
  const data = [
    { name: 'Totalt antal i databasen', count: totalProductsCount },
    { name: 'Ej sålda rader', count: unsoldProductsCount },
    { name: 'Sålda rader', count: soldProductsCount },
  ];

  const formatNumber = (num) => {
    // Return full number without shortening decimals
    return num.toLocaleString();
  };
  
  const chartColors = {
    total: "#6C8EBF",   // Blue
    unsold: "#F28C8C",   // Red
    sold: "#7DC77D",     // Green
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
        .attr("stop-opacity", 0.1);
  
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
        .attr("stop-opacity", 0.1);
  
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
        .attr("stop-opacity", 0.1);
  
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
          if (d.name === 'Totalt antal i databasen') return "url(#gradTotal)";
          if (d.name === 'Ej sålda rader') return "url(#gradUnsold)";
          return "url(#gradSold)";
        })
        .attr("rx", "8px")  // Apply border-radius only to the top corners
        .attr("ry", "8px")  // Apply vertical radius to top corners only
        .on("mouseover", function (event, d) {
          d3.select(this).style("opacity", 1);
        
  // Show tooltip with the name and the total product count
  tooltip.transition().duration(200).style("opacity", 0.9);
tooltip.html(
  d.name === 'Sålda rader'
    ? `Sålda: ${soldPercentage.toFixed(2)}%`
    : d.name === 'Ej sålda rader'
    ? `Ej sålda: ${unsoldPercentage.toFixed(2)}%`
    : `${d.name}: ${formatNumber(d.count)}`
)
  .style("left", `${event.pageX + 10}px`)  
  .style("top", `${event.pageY - 35}px`)   
  .style("padding", "10px")                
  .style("font-size", "14px");
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
      setError('Ingen fil vald');
      return;
    }

    setLoading(true);  // Show loading spinner/message
    setError(null);    // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/products/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,  // Ensure cookies are sent
      });

      setLoading(false);  // Hide loading spinner/message
      setSuccessMessage(response.data.message || 'Produkter importerade framgångsrikt.');
      
      // Reset the file input after successful upload
      fileInputRef.current.value = ''; // Reset the file input value

      // Reset the file state
      setFile(null);
    } catch (error) {
      setLoading(false);  // Hide loading spinner/message
      console.error('Error importing products:', error);
      setError('Ett fel inträffade vid import av produkter.');
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


   if (error) {
    return <div className="error">{error}</div>;
  }
  
 
return (
  <div className="data-section">
    <div className="box">
      <h2>Dataöversikt</h2>
      <svg ref={chartRef}></svg>
    </div>
    <div className='box'>
    <div className="stats-box">
        <h2 className="stats-title">Företagsuppgifter Översikt</h2>
        <div className="stats-details">
          <div className="stat-row">
            <strong className="stat-label"style={{ color: chartColors.unsold }}>Ej sålda:</strong>
            <h3 className="stat-percentage" style={{ color: chartColors.unsold }}>{formattedUnsoldPercentage}%</h3>
            <strong className="stat-value" style={{ color: chartColors.unsold }}>{formattedUnsold}</strong>
          </div>
          <div className="stat-row" >
            <strong className="stat-label" style={{ color: chartColors.sold }}>Sålda:</strong>
            <h3 className="stat-percentage" style={{ color: chartColors.sold }}>{formattedSoldPercentage}%</h3>
            <strong className="stat-value" style={{ color: chartColors.sold }}>{formattedSold}</strong>
          </div>
          <div className="stat-row">
            <strong className="stat-label" style={{ color: chartColors.total }}>Totalt:</strong>
            <h3 className="stat-value" style={{ color: chartColors.total }}>{formattedTotal}</h3>
          </div>
        </div>
      </div>

      <div>
      <h3>Importera fler företag</h3>
      <form className="upload-form">
        <label htmlFor="file-upload">Välj en Excel-fil</label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          id="file-upload"
          className="hidden-file-input"
          ref={fileInputRef}  // Attach the ref to the file input
        />
        <button
          className="button-positive"
          type="button" // Avoid default form submit
          onClick={handleFileUpload}
          disabled={!file || loading} // Disable button if no file is selected or if loading
        >
          {loading ? <LoadingSpinner /> : 'Importera filen'}  {/* Show spinner inside button */}
        </button>
      </form>
      <div>
        {error ? (
          <div className="error">{error}</div>
        ) : successMessage ? (
          <div className="success">{successMessage}</div>
        ) : null}
      </div>
    </div>
    </div>
  </div>
);
};

export default ProductsPage;
