'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidBlockProps {
    chart: string;
}

let mermaidInitialized = false;

const MermaidBlock: React.FC<MermaidBlockProps> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

    useEffect(() => {
        let cancelled = false;

        const renderChart = async () => {
            try {
                const mermaid = (await import('mermaid')).default;

                if (!mermaidInitialized) {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'base',
                        themeVariables: {
                            primaryColor: 'transparent',
                            primaryTextColor: '#ffffff',
                            primaryBorderColor: '#ffffff',
                            lineColor: '#ffffff',
                            secondaryColor: 'transparent',
                            tertiaryColor: 'transparent',
                            background: 'transparent',
                            mainBkg: 'transparent',
                            nodeBorder: '#ffffff',
                            clusterBkg: 'transparent',
                            titleColor: '#ffffff',
                            edgeLabelBackground: 'transparent',
                            nodeTextColor: '#ffffff',
                            textColor: '#ffffff',
                            labelTextColor: '#ffffff',
                            xyChart: {
                                backgroundColor: 'transparent',
                                titleColor: '#ffffff',
                                xAxisLabelColor: '#ffffff',
                                yAxisLabelColor: '#ffffff',
                                xAxisTitleColor: '#ffffff',
                                yAxisTitleColor: '#ffffff',
                                xAxisTickColor: '#ffffff',
                                yAxisTickColor: '#ffffff',
                                xAxisLineColor: '#ffffff',
                                yAxisLineColor: '#ffffff',
                                plotColorPalette: '#10b981,#6366f1,#f59e0b,#ef4444,#8b5cf6',
                            },
                        },
                        fontFamily: 'system-ui, sans-serif',
                        securityLevel: 'strict',
                    });
                    mermaidInitialized = true;
                }

                const { svg: renderedSvg } = await mermaid.render(idRef.current, chart.trim());
                if (!cancelled) {
                    // Remove background rects that Mermaid's xychart adds
                    const cleanedSvg = renderedSvg
                        .replace(/style="background-color:[^"]*"/g, '')
                        .replace(/<rect[^>]*class="background"[^>]*\/>/g, '')
                        .replace(/<rect[^>]*fill="(?!none|transparent)[^"]*"[^>]*class="[^"]*background[^"]*"[^>]*\/>/g, '');
                    setSvg(cleanedSvg);
                    setError(null);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err?.message || 'Failed to render diagram');
                    setSvg('');
                }
            }
        };

        renderChart();

        return () => {
            cancelled = true;
        };
    }, [chart]);

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-5">
                <p className="text-red-400 text-sm font-mono">Diagram error: {error}</p>
                <pre className="text-slate-400 text-xs mt-2 overflow-x-auto">{chart}</pre>
            </div>
        );
    }

    if (!svg) {
        return (
            <div className="bg-surface border border-surface-border/60 rounded-lg p-8 my-5 text-center">
                <p className="text-slate-400 text-sm">Rendering diagram...</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="mermaid-diagram my-2 overflow-x-auto flex justify-center max-w-sm [&_svg]:bg-transparent"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default MermaidBlock;
