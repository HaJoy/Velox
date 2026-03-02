import { getAllMeasurements } from "@/api/measurementService";
import { useEffect, useState } from "react"

export const Dashboard = () => {

    const [measurements, setMeasurements] = useState({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const getMeasurements = async () => {
        try {
            const measurements = await getAllMeasurements();
            console.log(measurements);
            setMeasurements(measurements);
        } catch (error) {
            console.error('Error trying to fetch measurements from Dashboard: ', error);
        } finally {
            setLoading(false)
        }
      }
      
      getMeasurements();
      
    }, [])
    

  return (
    <div>Dashboard</div>
  )
}
