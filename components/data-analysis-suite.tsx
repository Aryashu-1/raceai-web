"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Database,
  Upload,
  Download,
  Zap,
  Brain,
  Calculator,
  FileSpreadsheet,
  Filter,
  SortAsc,
  Eye,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Save,
  Share,
  Copy,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Layers,
  Grid,
  BarChart,
  Scatter,
  Activity,
} from "lucide-react"

interface Dataset {
  id: string
  name: string
  description: string
  rows: number
  columns: number
  size: string
  lastModified: Date
  type: "csv" | "json" | "excel" | "sql"
  status: "processing" | "ready" | "error"
}

interface AnalysisResult {
  id: string
  name: string
  type: "correlation" | "regression" | "clustering" | "classification" | "time-series"
  dataset: string
  accuracy?: number
  insights: string[]
  createdAt: Date
  visualizations: string[]
}

interface Chart {
  id: string
  name: string
  type: "bar" | "line" | "pie" | "scatter" | "histogram" | "heatmap"
  dataset: string
  xAxis: string
  yAxis?: string
  groupBy?: string
  config: any
}

export default function DataAnalysisSuite() {
  const [activeTab, setActiveTab] = useState("datasets")
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const datasets: Dataset[] = [
    {
      id: "dataset-1",
      name: "Quantum Error Rates",
      description: "Error correction performance data across different quantum systems",
      rows: 15420,
      columns: 12,
      size: "2.4 MB",
      lastModified: new Date(Date.now() - 3600000),
      type: "csv",
      status: "ready"
    },
    {
      id: "dataset-2",
      name: "Neural Network Training",
      description: "Training metrics and performance data for various ML models",
      rows: 8934,
      columns: 8,
      size: "1.8 MB",
      lastModified: new Date(Date.now() - 7200000),
      type: "json",
      status: "ready"
    },
    {
      id: "dataset-3",
      name: "Drug Discovery Results",
      description: "Compound screening results and molecular properties",
      rows: 45678,
      columns: 24,
      size: "12.6 MB",
      lastModified: new Date(Date.now() - 86400000),
      type: "excel",
      status: "processing"
    }
  ]

  const analysisResults: AnalysisResult[] = [
    {
      id: "analysis-1",
      name: "Quantum Error Correlation Analysis",
      type: "correlation",
      dataset: "dataset-1",
      accuracy: 0.94,
      insights: [
        "Strong negative correlation between temperature and error rates",
        "Gate fidelity shows exponential improvement with calibration frequency",
        "Coherence time directly impacts computational accuracy"
      ],
      createdAt: new Date(Date.now() - 3600000),
      visualizations: ["correlation-matrix", "scatter-plot", "time-series"]
    },
    {
      id: "analysis-2",
      name: "Neural Network Performance Clustering",
      type: "clustering",
      dataset: "dataset-2",
      insights: [
        "Models cluster into 3 distinct performance groups",
        "Learning rate and batch size are key differentiators",
        "Optimizer choice significantly impacts convergence"
      ],
      createdAt: new Date(Date.now() - 7200000),
      visualizations: ["cluster-plot", "feature-importance"]
    }
  ]

  const charts: Chart[] = [
    {
      id: "chart-1",
      name: "Error Rate Trends",
      type: "line",
      dataset: "dataset-1",
      xAxis: "time",
      yAxis: "error_rate",
      groupBy: "system_type",
      config: { showTrendline: true, confidence: true }
    },
    {
      id: "chart-2",
      name: "Performance Distribution",
      type: "histogram",
      dataset: "dataset-2",
      xAxis: "accuracy",
      config: { bins: 20, density: true }
    }
  ]

  const statisticalTests = [
    { name: "T-Test", description: "Compare means between two groups" },
    { name: "ANOVA", description: "Compare means across multiple groups" },
    { name: "Chi-Square", description: "Test independence of categorical variables" },
    { name: "Correlation", description: "Measure linear relationships" },
    { name: "Regression", description: "Model relationships between variables" }
  ]

  const mlAlgorithms = [
    { name: "Linear Regression", type: "regression", description: "Simple linear relationships" },
    { name: "Random Forest", type: "classification", description: "Ensemble method for classification" },
    { name: "K-Means", type: "clustering", description: "Partition data into clusters" },
    { name: "SVM", type: "classification", description: "Support vector machine classifier" },
    { name: "Neural Network", type: "deep-learning", description: "Deep learning models" }
  ]

  const getStatusIcon = (status: Dataset["status"]) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getChartIcon = (type: Chart["type"]) => {
    switch (type) {
      case "bar":
        return <BarChart className="h-4 w-4" />
      case "line":
        return <LineChart className="h-4 w-4" />
      case "pie":
        return <PieChart className="h-4 w-4" />
      case "scatter":
        return <Scatter className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Analysis Suite</h2>
          <p className="text-muted-foreground">Advanced analytics and visualization tools</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="visualization">Visualize</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="ml">Machine Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map(dataset => (
              <Card
                key={dataset.id}
                className={`glass-card cursor-pointer transition-all duration-200 ${
                  selectedDataset === dataset.id ? "border-primary/50 bg-primary/5" : "hover:border-border/60"
                }`}
                onClick={() => setSelectedDataset(dataset.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm">{dataset.name}</CardTitle>
                    </div>
                    {getStatusIcon(dataset.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">{dataset.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Rows:</span>
                      <span className="ml-1 font-medium">{dataset.rows.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Columns:</span>
                      <span className="ml-1 font-medium">{dataset.columns}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-1 font-medium">{dataset.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline" className="text-xs ml-1">
                        {dataset.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {dataset.lastModified.toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDataset && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Dataset Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-6 gap-2 text-xs font-medium mb-2">
                    <div className="p-2 bg-muted/30 rounded">ID</div>
                    <div className="p-2 bg-muted/30 rounded">Temperature</div>
                    <div className="p-2 bg-muted/30 rounded">Error Rate</div>
                    <div className="p-2 bg-muted/30 rounded">Gate Fidelity</div>
                    <div className="p-2 bg-muted/30 rounded">Coherence Time</div>
                    <div className="p-2 bg-muted/30 rounded">System Type</div>
                  </div>
                  {[1, 2, 3, 4, 5].map(row => (
                    <div key={row} className="grid grid-cols-6 gap-2 text-xs mb-1">
                      <div className="p-2 border border-border/30 rounded">{row}</div>
                      <div className="p-2 border border-border/30 rounded">{(Math.random() * 10).toFixed(2)}</div>
                      <div className="p-2 border border-border/30 rounded">{(Math.random() * 0.1).toFixed(4)}</div>
                      <div className="p-2 border border-border/30 rounded">{(0.9 + Math.random() * 0.1).toFixed(3)}</div>
                      <div className="p-2 border border-border/30 rounded">{(Math.random() * 100).toFixed(1)}</div>
                      <div className="p-2 border border-border/30 rounded">Superconducting</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Analysis Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Analyses</h3>
              {analysisResults.map(result => (
                <Card key={result.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm mb-1">{result.name}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">{result.type}</Badge>
                          {result.accuracy && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(result.accuracy * 100)}% accuracy
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {result.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Analysis */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Dataset</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map(dataset => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          {dataset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Correlation
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Distribution
                    </Button>
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Clustering
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Regression
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setIsAnalyzing(true)}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart Builder */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Chart Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                  <Button variant="outline" size="sm">
                    <LineChart className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm">
                    <PieChart className="h-4 w-4 mr-1" />
                    Pie
                  </Button>
                  <Button variant="outline" size="sm">
                    <Scatter className="h-4 w-4 mr-1" />
                    Scatter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Area
                  </Button>
                  <Button variant="outline" size="sm">
                    <Grid className="h-4 w-4 mr-1" />
                    Heatmap
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">X-Axis</label>
                  <Input placeholder="Select column..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Y-Axis</label>
                  <Input placeholder="Select column..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Group By</label>
                  <Input placeholder="Optional grouping..." />
                </div>

                <Button className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Chart
                </Button>
              </CardContent>
            </Card>

            {/* Existing Charts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Saved Charts</h3>
              {charts.map(chart => (
                <Card key={chart.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getChartIcon(chart.type)}
                        <span className="font-medium text-sm">{chart.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chart.xAxis} vs {chart.yAxis || "count"}
                      {chart.groupBy && ` • grouped by ${chart.groupBy}`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistical Tests */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Statistical Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statisticalTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{test.name}</h4>
                      <p className="text-xs text-muted-foreground">{test.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">μ = 0.0234</p>
                      <p className="text-xs text-muted-foreground">Mean</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">σ = 0.0089</p>
                      <p className="text-xs text-muted-foreground">Std Dev</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">0.0198</p>
                      <p className="text-xs text-muted-foreground">Median</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold">r = 0.87</p>
                      <p className="text-xs text-muted-foreground">Correlation</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Distribution Analysis</h4>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Normality Test</span>
                        <span className="text-green-600">p &lt; 0.05</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: "85%"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ML Algorithms */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Machine Learning Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mlAlgorithms.map((algorithm, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{algorithm.name}</h4>
                        <Badge variant="outline" className="text-xs">{algorithm.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{algorithm.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Brain className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "94.2%"}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precision</span>
                      <span className="font-medium">91.8%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: "91.8%"}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recall</span>
                      <span className="font-medium">89.3%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: "89.3%"}}></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <Button className="w-full" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Train New Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}