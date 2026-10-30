"use client";

import React, { useEffect, useRef } from "react";

export default function TechnicalBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for interactive network distortion
    const mouse = { x: null, y: null, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener("resize", handleResize);

    // Particle/Node representation on the MST Blockchain network topology
    let nodes = [];
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 55);

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const isValidator = Math.random() > 0.82; // 18% are primary validator nodes
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: isValidator ? Math.random() * 1.8 + 2.2 : Math.random() * 1.2 + 1.2,
          isValidator,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.03 + Math.random() * 0.02,
        });
      }
    }

    initNodes();

    // Render loop
    const maxDistance = 130;
    const maxDistSq = maxDistance * maxDistance;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse interaction (subtle push away)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            node.x += (dx / dist) * force * 1.8;
            node.y += (dy / dist) * force * 1.8;
          }
        }

        // Pulse
        node.pulse += node.pulseSpeed;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.6;

        // Connect with other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);

            if (node.isValidator || other.isValidator) {
              // MST Flame Red connector
              ctx.strokeStyle = `rgba(229, 46, 46, ${alpha * 1.35})`;
              ctx.lineWidth = 0.9;
            } else {
              // Subdued network link
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
              ctx.lineWidth = 0.55;
            }
            ctx.stroke();
          }
        }

        // Connect with mouse if nearby
        if (mouse.x !== null && mouse.y !== null) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 60, 60, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node point
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(currentRadius, 0.8), 0, Math.PI * 2);

        if (node.isValidator) {
          ctx.fillStyle = "#ff2d2d";
          ctx.shadowColor = "rgba(229, 46, 46, 0.75)";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = "rgba(240, 240, 255, 0.65)";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Cybernetic Technical Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(229, 46, 46, 0.4) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 80px 80px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />

      {/* 2. Scanning Technical Radar Laser Beam */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        <div className="technical-scanline" />
      </div>

      {/* 3. HTML5 Canvas: Live MST Node Graph Topology */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />

      {/* 4. Technical HUD Coordinate Indicators in Margins */}
      <div className="hidden xl:flex absolute top-24 left-8 text-[9px] font-mono text-red-500/40 tracking-widest space-y-1 flex-col select-none">
        <span>+ NETWORK: MST EVM L1</span>
        <span>+ CONSENSUS: PoSA [4000+ TPS]</span>
        <span>+ FINALITY: ~3.0s DETERMINISTIC</span>
      </div>

      <div className="hidden xl:flex absolute top-24 right-8 text-[9px] font-mono text-red-500/40 tracking-widest space-y-1 flex-col items-end select-none">
        <span>[RPC: TESTNET:91562037 / MAINNET:4646]</span>
        <span>[STATUS: VALIDATING BLOCKS]</span>
        <span>[ENCRYPTION: SECP256K1 / KECCAK256]</span>
      </div>

      <div className="hidden xl:flex absolute bottom-8 left-8 text-[9px] font-mono text-slate-500/30 tracking-widest select-none">
        <span>MST-RWA-CORE // v1.0.4 CANCUN READY</span>
      </div>

      <div className="hidden xl:flex absolute bottom-8 right-8 text-[9px] font-mono text-slate-500/30 tracking-widest select-none">
        <span>PINATA-IPFS // GATEWAY SYNC: 100%</span>
      </div>
    </div>
  );
}
