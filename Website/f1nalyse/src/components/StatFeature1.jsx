import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { act, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";


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
  WET: "#018dd2",
};

const tyreImages = {
  SOFT: `/photos/soft_tyres.png`,
  MEDIUM: `/photos/medium_tyres.png`,
  HARD: "/photos/hard_tyres.png",
  INTERMEDIATE: "/photos/intermediate_tyres.png",
  WET: "/photos/wet_tyres.png",
};

const tyreImages2 = {
  HYPERSOFT: "/photos/hypersoft_tyres.png",
  ULTRASOFT: "/photos/ultrasoft_tyres.png",
  SUPERSOFT: "/photos/supersoft_tyres.png",
  SOFT: "/photos/soft2_tyres.png",
  MEDIUM: "/photos/medium2_tyres.png",
  HARD: "/photos/hard2_tyres.png",
  SUPERHARD: "/photos/superhard_tyres.png",
  INTERMEDIATE: "/photos/intermediate_tyres.png",
  WET: "/photos/wet_tyres.png",
};

function CustomTooltip({ payload, label, active, activeYear }) {
  if (!active || !payload?.length) return null;

  const filteredPayload = payload.filter((entry) => entry.value > 0);
  const imageMap =
    Number(activeYear) > 2019 || activeYear == null ? tyreImages : tyreImages2;

  if (!filteredPayload.length) return null;


  return (
    <div
      style={{
        backgroundColor: "#14131a",
        padding: 7,
        borderRadius: 10,
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        zIndex: 999,
      }}
    >
      <p
        style={{ fontWeight: "bold", marginBottom: 5, fontFamily: "formula1" }}
      >
        {label}
      </p>
      {filteredPayload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
        >
          <img
            src={imageMap[entry.dataKey] || "/soft_tyres.png"}
            alt={entry.dataKey}
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <span className="font-titiliumbold">
            {entry.dataKey}: {entry.value} Laps
          </span>
        </div>
      ))}
    </div>
  );
}

const renderCustomLabel = (data) => {
  const { value, x, y, width, height } = data;

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

export default function StatFeature1({ laps, activeYear }) {

  console.log(activeYear);
  const [hovered, setHovered] = useState(false);
  const compoundColours =
    Number(activeYear) > 2019 || activeYear == null
      ? tyreColours
      : tyreColours2;

  const allCompounds = Object.keys(compoundColours);

  const processedData = laps.map((driver) => {
    const counts = {};
    allCompounds.forEach((compound) => {
      counts[compound] = driver.laps.filter(
        (lap) => lap.tyre === compound,
      ).length;
    });
    return {
      driver: driver.driver,
      ...counts,
    };
  });

  console.log(processedData);

  return (
    <div className="flex justify-center items-start pt-10 h-205">
      <div className="relative w-320 h-190 bg-[#14131a] brightness-125 shadow-[0_0_10px_#000000] rounded-[20px]">
        <div className="p-5 font-formula1bold text-[30px]">
          <p>Tyre Stints</p>
        </div>

        <div class="absolute top-5 right-5 flex flex-col items-end">
          <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
            <FaCircleInfo
              className={`text-[20px] transition-all duration-200 cursor-pointer`}
            />
          </button>

          <div
            className={`mt-2 w-70 bg-[#14131a] brightness-125 text-black text-sm p-3 rounded-xl shadow-lg transition-all duration-500 origin-top-right border-[2px] border-white
            ${hovered
                ? "opacity-100 z-50"
                : "opacity-0 z-50"
              }`}
          >
            <p className="font-formula1bold text-white">Tyre Info</p>
            {activeYear > 2019 || activeYear == null ?
              <p className="text-sm mt-3 text-white">
                <ul className="pl-5 gap-3 flex flex-col">
                  <li><span className="font-formula1bold">SOFT</span>: Highest grip, but but least durable.</li>
                  <li><span className="font-formula1bold">MEDIUM</span>: Balanced offering a mix of performance and durability.</li>
                  <li><span className="font-formula1bold">HARD</span>: Lowest grip but most durable.</li>
                  <li><span className="font-formula1bold">INTERMEDIATE</span>: For light damp wet conditions.</li>
                  <li><span className="font-formula1bold">WET</span>: Used in heavy rain, has deeper grooves for more water dispersion.</li>
                </ul>
              </p>
              : <p className="text-sm mt-3 text-white">
                <ul className="pl-5 gap-3 flex flex-col">
                  <li><span className="font-formula1bold">HYPERSOFT</span>: Highest grip, but least durable.</li>
                  <li><span className="font-formula1bold">ULTRASOFT</span>: High grip, but more durable than HYPERSOFT.</li>
                  <li><span className="font-formula1bold">SUPERSOFT</span>: Good grip and is perfect for qualifying.</li>
                  <li><span className="font-formula1bold">SOFT</span>: Balanced durability and performance.</li>
                  <li><span className="font-formula1bold">MEDIUM</span>: Complete balance of grip and durability.</li>
                  <li><span className="font-formula1bold">HARD</span>: Less grip than MEDIUM but more durable.</li>
                  <li><span className="font-formula1bold">SUPERHARD</span>: Lowest grip but most durable.</li>
                  <li><span className="font-formula1bold">INTERMEDIATE</span>: For light damp wet conditions.</li>
                  <li><span className="font-formula1bold">WET</span>: Used in heavy rain, has deeper grooves for more water dispersion.</li>
                </ul>
              </p>}
          </div>
        </div>

        <div>
          <ResponsiveContainer width="98%" height={650}>
            <BarChart
              layout="vertical"
              data={processedData}
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
            >
              <XAxis type="number" fontFamily="formula1bold" />
              <YAxis
                interval={0}
                dataKey="driver"
                type="category"
                fontFamily="formula1bold"
                tick={({ x, y, payload }) => {
                  const driverEntry = laps.find(
                    (d) => d.driver === payload.value,
                  );
                  const color = driverEntry?.color || "#FFFFFF";

                  return (
                    <text
                      x={x - 10}
                      y={y + 5}
                      textAnchor="end"
                      fill={color}
                      fontFamily="formula1bold"
                      fontSize={12}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <Tooltip content={<CustomTooltip activeYear={activeYear} />} />

              {allCompounds.map((compound) => (
                <Bar
                  key={compound}
                  dataKey={compound}
                  stackId="a"
                  fill={compoundColours[compound]}
                  label={renderCustomLabel}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
