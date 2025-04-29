import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController,
  type ChartTypeRegistry,
} from "chart.js"
import { Chart as ReactChart } from "react-chartjs-2"

// Define ChartData type manually since it's not exported from chart.js
export type ChartData = {
  labels?: string[]
  datasets: {
    label?: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    yAxisID?: string
    type?: keyof ChartTypeRegistry
    fill?: boolean
  }[]
}

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController,
)

export {
  ReactChart as Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController,
}
