import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tyreColours = {
  SOFT: "#ff2e2e", 
  MEDIUM: "#ffd800",
  HARD: "#ffffff",
  INTERMEDIATE: "#00ff00",
  WET: "#0066ff",
};

const tyreColours2 = {
  HYPERSOFT: "#ffb4c4",
  ULTRASOFT: "#b34aa8",
  SUPERSOFT: "#ff2928",
  SOFT: "#fed311",
  MEDIUM: "#ffffff",
  HARD: "#00a3f3",
  SUPERHARD: "#ff803c",
  INTERMEDIATE: "#3ecc2e",
  WET: "#018dd2"
}

const tyreImages = {
  SOFT: `/soft_tyres.png`, 
  MEDIUM: "/medium_tyres.png",
  HARD: "/hard_tyres.png",
  INTERMEDIATE: "/intermediate_tyres.png",
  WET: "/wet_tyres.png",
}; 

function CustomTooltip({ payload, label, active }) {
  if (active && payload && payload.length) {
    return (
      <div
      style={{
        backgroundColor: "#14131a",
        padding: "10px",
        borderRadius: "8px",
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: 5 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 20,
              height: 10,
              backgroundColor: entry.colour,
              marginRight: 8,
            }}
          />
          <img src={tyreImages[entry.dataKey]} alt={entry.dataKey} style={{ width: 200, height: 100, marginRight: 8 }} />
          <span>
            {entry.dataKey}: {entry.value} laps
          </span>
        </div>
      ))}
    </div>
    );
  }

  return null;
}

const renderCustomLabel = (props) => {
  const { value, x, y, width, height } = props;

  // Hide if zero OR no visible width
  if (!value || width <= 0) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#000"
      fontSize={12}
      fontFamily="formula1bold"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
};

export default function StatFeature1({ laps }) {
  return (
    <div className="flex justify-center items-start pt-10 h-400">
        <div className="relative w-320 h-190 bg-[#14131a] brightness-125 shadow-[0_0_10px_#000000] rounded-[20px]">
            <div className="p-5 font-formula1bold text-[30px]">
                <p>Tyre Stints</p>
            </div>

            <div>
                <ResponsiveContainer width="98%" height={650}>
                <BarChart
                    layout="vertical"
                    data={laps}
                >
                    <XAxis type="number" fontFamily="formula1bold"/>
                    <YAxis dataKey="driver" type="category" fontFamily="formula1bold"/>
                    <Tooltip content={<CustomTooltip />} />

                    {Object.keys(tyreColours).map((compound) => (
                    <Bar
                        label={renderCustomLabel}
                        key={compound}
                        dataKey={(entry) =>
                        entry.laps.filter((lap) => lap.tyre === compound).length
                        }
                        stackId="a"
                        fill={tyreColours[compound]}
                    />
                    ))}
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}