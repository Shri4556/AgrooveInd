import DashboardCard from "../components/DashboardCard";
import { FaCloudSun, FaSeedling, FaRobot } from "react-icons/fa";

<DashboardCard
    icon={<FaCloudSun />}
    title="Weather"
    description="Check today's weather forecast."
    buttonText="Open"
    onClick={() => navigate("/weather")}
/>

<DashboardCard
    icon={<FaSeedling />}
    title="Crop Recommendation"
    description="Find the best crop for your farm."
    buttonText="Open"
    onClick={() => navigate("/advisory");}
/>

<DashboardCard
    icon={<FaRobot />}
    title="AI Assistant"
    description="Ask farming-related questions."
    buttonText="Chat"
    onClick={() => navigate("/chatbot")}
/>