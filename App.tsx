import React, { useState, useEffect } from "react";
import { HelpCircle, CloudSun, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { EsriFireMap } from "./components/EsriFireMap";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import LeftControl from "./imports/LeftControl";
import svgPaths from "./imports/svg-elkviwiei1";

// Tab Components
function WeatherAnalyticsTab() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div
        aria-hidden="true"
        className="absolute border-[#38b7fe] border-[0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[8px] relative w-full">
          <div className="relative shrink-0 size-5">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 12C5.55228 12 6 12.4477 6 13C6 13.5523 5.55228 14 5 14C4.44772 14 4 13.5523 4 13C4 12.4477 4.44772 12 5 12ZM9 12C9.55228 12 10 12.4477 10 13C10 13.5523 9.55228 14 9 14C8.44772 14 8 13.5523 8 13C8 12.4477 8.44772 12 9 12ZM13 12C13.5523 12 14 12.4477 14 13C14 13.5523 13.5523 14 13 14C12.4477 14 12 13.5523 12 13C12 12.4477 12.4477 12 13 12ZM15 8H5C4.44772 8 4 7.55228 4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8Z"
                fill="#38b7fe"
              />
            </svg>
          </div>
          <div
            className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#38b7fe] text-[24px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[32px] whitespace-pre">
              Weather Analytics
            </p>
          </div>
        </div>

        {/* AI Chatbot removed */}
      </div>
    </div>
  );
}

function OutagePredictionTab() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div
        aria-hidden="true"
        className="absolute border-[#353a40] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[8px] relative w-full">
          <div className="relative shrink-0 size-5">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M13 3L15.5 6H10.5L13 3ZM7 17L4.5 14H9.5L7 17ZM10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z"
                fill="#afb5bc"
              />
            </svg>
          </div>
          <div
            className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#afb5bc] text-[24px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[32px] whitespace-pre">
              Outage Prediction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState([
    "firePerimeters",
  ]);
  const [selectedModel, setSelectedModel] = useState("ESRI");
  const [selectedHazard, setSelectedHazard] =
    useState("Embers");
  const [selectedTab, setSelectedTab] = useState<"weather" | "outage">("weather");
  const [actionModal, setActionModal] = useState<
    | null
    | {
        id: string;
        title: string;
        why: string;
        resources: string[];
        eta: string;
        projectedOutcome: string;
        alignedObjective: string;
      }
  >(null);
  const [actionSubmitted, setActionSubmitted] = useState(false);

  type ActionRec = { id: string; title: string; why: string; resources: string[]; eta: string };
  const [recommendedActions, setRecommendedActions] = useState<ActionRec[]>([
    {
      id: "helicopters-front-street",
      title: "Dispatch 2 Helicopter Crews to Front Street",
      why: "Aerial support reduces spread toward dense structures; wind window favorable for bucket drops.",
      resources: ["2 Helicopters", "Aviation Ops", "Fuel & Foam"],
      eta: "Within 45 minutes",
    },
    {
      id: "generators-front-main",
      title: "Move 3 Power Generators to Front Street & Main Street Intersection",
      why: "Maintains communications and critical services if grid is interrupted by hazards.",
      resources: ["3 Portable Generators", "Traffic Control", "Fuel"],
      eta: "Within 60 minutes",
    },
  ]);

  // Objectives action modal (for ongoing/recommended items inside Objectives card)
  const [objectiveModal, setObjectiveModal] = useState<
    | null
    | {
        type: 'recommended' | 'ongoing';
        title: string;
        resources: string[];
        projectedOutcome: string;
        rationale: string;
      }
  >(null);

  // Timeline state
  const [timelineNow] = useState<Date>(new Date());
  const [incidentStart] = useState<Date>(new Date(Date.now() - 12 * 60 * 60 * 1000));
  const endTime = new Date(timelineNow.getTime() + 12 * 60 * 60 * 1000);
  const clampTime = (d: Date) => new Date(Math.max(incidentStart.getTime(), Math.min(endTime.getTime(), d.getTime())));
  const [currentTime, setCurrentTime] = useState<Date>(timelineNow);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  // Ask PRATUS (header input) state
  const [askPratusInput, setAskPratusInput] = useState("");
  const [isAskPratusResponseOpen, setIsAskPratusResponseOpen] = useState(false);
  const [askPratusActionRequest, setAskPratusActionRequest] = useState(
    "Request: Pre-position structure protection teams to Front Street corridor.\n" +
      "Resources: 2 Engine Companies, 1 Ladder Truck, 1 Water Tender.\n" +
      "ETA: 45 minutes.\n" +
      "Objective: Life Safety & Incident Stabilization."
  );

  // Auto-play timeline forward
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const id = setInterval(() => {
      setCurrentTime((prev) => {
        const next = new Date(prev.getTime() + 15 * 60 * 1000); // +15 minutes
        return clampTime(next);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlayingTimeline]);

  // Static cell configuration for independent positioning and sizing
  // Edit these values to customize each pill's appearance and position
  const cellConfigs = {
    Embers: {
      "90% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        }, // Day 1: "2.1 E"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        }, // Day 2: "2.3 NE"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        }, // Day 3: "2.5 E"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        }, // Day 4: "2.7 NE"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        }, // Day 5: "2.4 N"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        }, // Day 6: "2.6 E"
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        }, // Day 7: "2.9 E"
      ],
      "75% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "Mean Scenario": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "25% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "10% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 11,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
    },
    "Fire Perimeters": {
      "90% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "75% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "Mean Scenario": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "25% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
      "10% Probability": [
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 10,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
        {
          width: 60,
          height: 32,
          x: 0,
          y: 0,
          padding: 4,
          fontSize: 12,
          visible: true,
        },
      ],
    },
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId],
    );
  };

  const hazardOptions = [
    { id: "embers", label: selectedTab === 'outage' ? 'Outage Probability' : 'Fire Ignition' },
    { id: "firePerimeters", label: selectedTab === 'outage' ? 'Residents Impacted' : 'Wind Risk' },
  ];

  const modelOptions = [
    { id: "skytl", label: "SkyTL" },
    { id: "esri", label: "ESRI" },
  ];

  function generateProjectedOutcome(action: { title: string; resources: string[] }) {
    const t = action.title.toLowerCase();
    if (t.includes('helicopter')) {
      return 'Contain spread toward Front Street within 2–3 hours and reduce ember cast by ~35% in the next operational period.';
    }
    if (t.includes('generator')) {
      return 'Maintain critical power and communications at the intersection; reduce hazard-caused outage risk by ~20% over the next 6 hours.';
    }
    return 'Improve incident stabilization and reduce structure impact within the next operational period.';
  }

  function generateAlignedObjective(action: { title: string }) {
    const t = action.title.toLowerCase();
    if (t.includes('helicopter')) {
      return 'Life Safety & Incident Stabilization — rapid aerial suppression to protect populated/cultural assets along Front Street.';
    }
    if (t.includes('generator')) {
      return 'Incident Stabilization & Property Preservation — sustain essential services and communications at a critical junction.';
    }
    return 'Supports ICS objectives: life safety, incident stabilization, and property preservation.';
  }

  function ActionPill({ action }: { action: ActionRec }) {
    return (
      <button
        onClick={() => {
          setActionSubmitted(false);
          setActionModal({
            ...action,
            projectedOutcome: generateProjectedOutcome(action),
            alignedObjective: generateAlignedObjective(action),
          });
        }}
        className="group text-foreground border border-border/60 bg-gradient-to-br from-secondary/70 to-secondary/40 hover:from-secondary/80 hover:to-secondary/60 px-4 py-3 rounded-lg text-sm transition-all shadow-sm hover:shadow-md flex flex-col items-start gap-1 min-w-[260px]"
      >
        <span className="font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-primary/80 group-hover:bg-primary" />
          {action.title}
        </span>
        <span className="text-xs text-muted-foreground">
          Rationale: {action.why}
        </span>
      </button>
    );
  }

  // Risk data for each hazard and day - using 8 pills per day like in Figma
  const riskData: Record<'Embers' | 'Fire Perimeters' | 'Containment', string[][]> = {
    Embers: [
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 1: 8 low
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#fdb022",
        "#fdb022",
        "#dc6803",
        "#dc6803",
      ], // Day 2: 4 low, 2 medium, 2 high
      [
        "#dc6803",
        "#fdb022",
        "#fdb022",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 3: 1 high, 2 medium, 5 low
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 4: 8 low
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 5: 8 low
    ],
    "Fire Perimeters": [
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 1: 8 low
      [
        "#039855",
        "#039855",
        "#fdb022",
        "#fdb022",
        "#fdb022",
        "#dc6803",
        "#dc6803",
        "#b42318",
      ], // Day 2: 2 low, 3 medium, 2 high, 1 extreme
      [
        "#b42318",
        "#b42318",
        "#b42318",
        "#dc6803",
        "#fdb022",
        "#fdb022",
        "#039855",
        "#039855",
      ], // Day 3: 3 extreme, 1 high, 2 medium, 2 low
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 4: 8 low
      [
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
        "#039855",
      ], // Day 5: 8 low
    ],
    Containment: [
      ["#039855","#039855","#039855","#039855","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#039855","#039855","#039855","#039855","#fdb022","#fdb022"],
      ["#039855","#039855","#039855","#039855","#fdb022","#fdb022","#dc6803","#dc6803"],
      ["#039855","#039855","#039855","#039855","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#039855","#039855","#039855","#039855","#039855","#039855"],
    ],
  };

  // Peak system data for different hazard types
  const peakSystemData = {
    Embers: {
      title: "",
      scenarios: [
        {
          name: "90% Probability",
          values: [
            "2.1 E",
            "2.3 NE",
            "2.5 E",
            "2.7 NE",
            "2.4 N",
            "2.6 E",
            "2.9 E",
          ],
        },
        {
          name: "75% Probability",
          values: [
            "2.4 E",
            "2.7 NE",
            "2.9 E",
            "3.1 NE",
            "2.8 N",
            "3.2 E",
            "3.6 E",
          ],
        },
        {
          name: "Mean Scenario",
          values: [
            "2.8 E",
            "3.1 NE",
            "3.4 E",
            "3.8 NE",
            "3.5 N",
            "4.1 E",
            "4.7 E",
          ],
        },
        {
          name: "25% Probability",
          values: [
            "3.2 E",
            "3.6 NE",
            "4.1 E",
            "4.5 NE",
            "4.2 N",
            "4.9 E",
            "5.8 E",
          ],
        },
        {
          name: "10% Probability",
          values: [
            "3.6 E",
            "4.2 NE",
            "4.8 E",
            "5.3 NE",
            "5.1 N",
            "6.2 E",
            "7.1 E",
          ],
        },
      ],
    },
    "Fire Perimeters": {
      title: "",
      scenarios: [
        {
          name: "90% Probability",
          values: [
            "0.8 S",
            "0.9 NW",
            "1.1 W",
            "1.2 NW",
            "0.9 N",
            "1.0 S",
            "1.4 S",
          ],
        },
        {
          name: "75% Probability",
          values: [
            "1.1 S",
            "1.3 NW",
            "1.5 W",
            "1.7 NW",
            "1.4 N",
            "1.6 S",
            "2.1 S",
          ],
        },
        {
          name: "Mean Scenario",
          values: [
            "1.4 S",
            "1.7 NW",
            "2.0 W",
            "2.3 NW",
            "2.0 N",
            "2.4 S",
            "2.9 S",
          ],
        },
        {
          name: "25% Probability",
          values: [
            "1.8 S",
            "2.2 NW",
            "2.6 W",
            "3.1 NW",
            "2.8 N",
            "3.4 S",
            "4.2 S",
          ],
        },
        {
          name: "10% Probability",
          values: [
            "2.3 S",
            "2.8 NW",
            "3.4 W",
            "4.1 NW",
            "3.7 N",
            "4.6 S",
            "5.8 S",
          ],
        },
      ],
    },
  };

  // Outage-mode data (plausible values, same structure)
  const outageRiskData: Record<'Embers' | 'Fire Perimeters', string[][]> = {
    Embers: [
      ["#039855","#039855","#039855","#fdb022","#fdb022","#039855","#039855","#039855"],
      ["#fdb022","#fdb022","#dc6803","#dc6803","#039855","#039855","#039855","#039855"],
      ["#dc6803","#fdb022","#fdb022","#039855","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#039855","#039855","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#fdb022","#039855","#039855","#039855","#039855","#039855"],
    ],
    "Fire Perimeters": [
      ["#039855","#039855","#fdb022","#039855","#039855","#039855","#039855","#039855"],
      ["#fdb022","#dc6803","#dc6803","#b42318","#fdb022","#039855","#039855","#039855"],
      ["#b42318","#dc6803","#fdb022","#fdb022","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#039855","#039855","#039855","#039855","#039855","#039855"],
      ["#039855","#039855","#039855","#fdb022","#039855","#039855","#039855","#039855"],
    ],
  };

  const outagePeakSystemData: typeof peakSystemData = {
    Embers: {
      title: "",
      scenarios: [
        { name: "90% Probability", values: ["2.0","2.2","2.4","2.6","2.3","2.5","2.8"] },
        { name: "75% Probability", values: ["2.3","2.6","2.9","3.1","2.7","3.0","3.5"] },
        { name: "Mean Scenario", values: ["2.7","3.0","3.3","3.6","3.3","3.9","4.5"] },
        { name: "25% Probability", values: ["3.1","3.5","4.0","4.4","4.1","4.8","5.7"] },
        { name: "10% Probability", values: ["3.5","4.1","4.7","5.2","5.0","6.1","7.0"] },
      ],
    },
    "Fire Perimeters": {
      title: "Peak Grid Failure Spread Rate (mph)",
      scenarios: [
        { name: "90% Probability", values: ["0.7","0.8","1.0","1.1","0.8","0.9","1.3"] },
        { name: "75% Probability", values: ["1.0","1.2","1.4","1.6","1.3","1.5","2.0"] },
        { name: "Mean Scenario", values: ["1.3","1.6","1.9","2.2","1.9","2.3","2.9"] },
        { name: "25% Probability", values: ["1.7","2.1","2.6","3.1","2.8","3.5","4.4"] },
        { name: "10% Probability", values: ["2.1","2.7","3.3","3.8","3.6","4.7","5.6"] },
      ],
    },
  };

  const currentRiskData = selectedTab === "outage" ? outageRiskData : riskData;
  const currentPeakData = (selectedTab === "outage" ? outagePeakSystemData : peakSystemData)[(selectedHazard as 'Embers' | 'Fire Perimeters')];
  const HAZARD_DISPLAY_LABEL: Record<'Embers' | 'Fire Perimeters', string> = {
    Embers: selectedTab === 'outage' ? 'Outage Probability' : 'Fire Ignition',
    'Fire Perimeters': selectedTab === 'outage' ? 'Residents Impacted' : 'Wind Risk',
  };
  
  // Track expanded scenario rows in Peak System table
  const [expandedScenarioNames, setExpandedScenarioNames] = useState<Record<string, boolean>>({});
  const toggleScenarioExpanded = (scenarioName: string) => {
    setExpandedScenarioNames((prev) => ({ ...prev, [scenarioName]: !prev[scenarioName] }));
  };

  // Helper to slightly adjust a value string like "3.2 E" by a delta
  const adjustValueString = (valueStr: string, delta: number) => {
    const [numStr, dir = ""] = valueStr.trim().split(/\s+/);
    const base = parseFloat(numStr || "0");
    const adjusted = (isNaN(base) ? 0 : base) + delta;
    return `${adjusted.toFixed(1)}${dir ? " " + dir : ""}`;
  };

  // Parse the leading numeric part of a value string like "3.2 E"
  const parseLeadingNumber = (valueStr: string) => {
    const match = valueStr.match(/-?\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Map a numeric magnitude to ROS 0–100 scale; hazard-specific normalization
  const formatRos = (valueStr: string, hazard: string) => {
    const num = parseLeadingNumber(valueStr);
    if (isNaN(num)) return "0";
    const max = hazard === 'Embers' ? 7.5 : 6.0; // normalize plausible ranges to 0–100
    const ros = Math.min(100, Math.max(0, Math.round((num / max) * 100)));
    return `${ros}`;
  };

  // Generate 5 synthetic child rows for a scenario
  const generateChildRows = (scenario: { name: string; values: string[] }) => {
    const locations = [
      "Lahaina Harbor",
      "Front Street District",
      "Ka'anapali Ridge",
      "Launiupoko Reserve",
      "Wahikuli Terrace",
    ];
    return locations.map((loc, idx) => ({
      name: loc,
      values: scenario.values.map((v) => adjustValueString(v, (idx + 1) * 0.1)),
    }));
  };
  
  // Shared layout constants to keep both tables aligned and visible without horizontal scrolling
  const LABEL_COL_WIDTH = 200; // px - left column width for both tables (more compact)
  const DAY_COL_WIDTH = 82;    // px - day column width for both tables (fits without scroll)
  const PEAK_DAY_INDEXES = [0, 1, 2, 3, 4]; // Show 5 days

  // Tooltip helpers
  const threeHourBlocks = [
    "00:00–03:00",
    "03:00–06:00",
    "06:00–09:00",
    "09:00–12:00",
    "12:00–15:00",
    "15:00–18:00",
    "18:00–21:00",
    "21:00–24:00",
  ];
  const formatDayDate = (dayIndex: number) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  const getIgnitionComponentFromColor = (colorHex: string) => {
    switch (colorHex.toLowerCase()) {
      case "#039855":
        return 20; // low IC
      case "#fdb022":
        return 55; // moderate IC
      case "#dc6803":
        return 75; // high IC
      case "#b42318":
        return 90; // very high IC
      default:
        return 40;
    }
  };

  const getRateOfSpreadFromColor = (colorHex: string) => {
    // Map colors to ROS buckets; units implicitly understood by end users
    switch (colorHex.toLowerCase()) {
      case "#039855":
        return "ROS: Low";
      case "#fdb022":
        return "ROS: Moderate";
      case "#dc6803":
        return "ROS: High";
      case "#b42318":
        return "ROS: Extreme";
      default:
        return "ROS: Moderate";
    }
  };

  // Function to get cell color based on value and hazard type
  const getCellColor = (value: string, hazard: string) => {
    const numValue = parseFloat(value);

    if (hazard === "Embers") {
      if (numValue <= 2.5) return "#039855"; // Green - Low
      if (numValue <= 4.0) return "#fdb022"; // Yellow - Medium
      if (numValue <= 5.5) return "#dc6803"; // Orange - High
      return "#b42318"; // Red - Extreme
    } else {
      // Fire Perimeters
      if (numValue <= 1.5) return "#039855"; // Green - Low
      if (numValue <= 2.5) return "#fdb022"; // Yellow - Medium
      if (numValue <= 4.0) return "#dc6803"; // Orange - High
      return "#b42318"; // Red - Extreme
    }
  };

  // Function to get cell configuration
  const getCellConfig = (
    hazard: string,
    scenario: any,
    dayIndex: number,
  ) => {
    const cfg = (cellConfigs as any)[hazard]?.[scenario]?.[dayIndex];
    return cfg || {
        width: 60,
        height: 32,
        x: 0,
        y: 0,
        padding: 4,
        fontSize: 12,
        visible: true,
      };
  };

  return (
    <div className="min-h-screen bg-[#090909] relative">
      {/* Top Navigation Bar */}
      <header className="absolute bg-[#353a40] h-16 left-0 top-0 w-full z-50">
        <div className="flex items-center">
          <LeftControl />
        </div>

        {/* Center Search */}
        <div className="absolute bg-[#222529] box-border flex items-center justify-center left-1/2 px-3 py-2 rounded-md top-1/2 translate-x-[-50%] translate-y-[-50%] w-[360px]">
          <div className="relative flex items-center gap-2 w-full">
            <div className="relative shrink-0 size-4">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"
                  fill="#AFB5BC"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ask PRATUS"
              className="w-full bg-transparent outline-none text-center text-[#afb5bc] text-[16px] placeholder:text-[#afb5bc]"
              value={askPratusInput}
              onChange={(e) => setAskPratusInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && askPratusInput.trim().length > 0) {
                  setIsAskPratusResponseOpen(true);
                }
              }}
            />
          </div>
        </div>

        {/* Right Control */}
        <div className="absolute box-border content-stretch flex flex-row gap-4 h-16 items-center justify-end right-8 top-0">
          <div className="box-border content-stretch flex flex-row gap-[13px] items-center justify-center p-0 relative rounded-md shrink-0">
            <div className="box-border content-stretch flex flex-col gap-4 items-start justify-center p-0 relative shrink-0">
              <div
                className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <p className="block leading-[18px] whitespace-pre">
                  Thu Aug 8
                </p>
              </div>
            </div>
            <div className="bg-[#222529] box-border content-stretch flex flex-col gap-2 items-start justify-center px-3 py-2 relative rounded shrink-0">
              <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start leading-[0] p-0 relative shrink-0 text-center text-nowrap">
                <div
                  className="relative shrink-0 text-[#ffffff] text-[14px]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  <p className="block leading-none text-nowrap whitespace-pre">
                    14:42
                  </p>
                </div>
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[#afb5bc] text-[12px]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  <p className="block leading-none text-nowrap whitespace-pre">
                    HST/GMT-10
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="bg-center bg-cover bg-no-repeat h-[46px] rounded-[72px] shrink-0 w-11 bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>
      </header>

      {/* Main Content */}
      <div className="absolute box-border content-stretch flex flex-col gap-4 items-start justify-start left-[7px] pb-4 pl-6 pr-8 pt-2 top-16 w-[calc(100%-14px)]">
        {/* Tab Navigation */}
        <div className="bg-[#14171a] box-border content-stretch flex flex-row items-start justify-start p-0 shrink-0 sticky top-0 w-full">
          <button
            onClick={() => setSelectedTab("weather")}
            className={`basis-0 grow min-h-px min-w-px relative shrink-0 py-2 border-b ${selectedTab==='weather' ? 'border-blue-400' : 'border-transparent'}`}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <CloudSun className={`h-5 w-5 ${selectedTab==='weather' ? 'text-blue-400' : 'text-muted-foreground'}`} />
              <span className={`text-[24px] font-semibold ${selectedTab==='weather' ? 'text-blue-400' : 'text-muted-foreground'}`}>Weather Analytics</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab("outage")}
            className={`basis-0 grow min-h-px min-w-px relative shrink-0 py-2 border-b ${selectedTab==='outage' ? 'border-blue-400' : 'border-[#353a40]'}`}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <Zap className={`h-5 w-5 ${selectedTab==='outage' ? 'text-blue-400' : 'text-muted-foreground'}`} />
              <span className={`text-[24px] font-semibold ${selectedTab==='outage' ? 'text-blue-400' : 'text-muted-foreground'}`}>Outage Prediction</span>
            </div>
          </button>
        </div>

        {/* Removed header to move content up */}

        {/* Split Layout - Map and Controls */}
        <div className="box-border content-stretch flex flex-row gap-6 h-[1440px] items-start justify-start p-0 relative shrink-0 w-full">
          {/* Left Side - Fire Map */}
          <div className="bg-[#14171a] box-border content-stretch flex flex-col gap-3 items-start justify-start overflow-clip p-0 relative shrink-0 w-[917px] rounded">

            {/* Objectives Card moved to right panel */}

            {/* Fire Map */}
            <div className="bg-[#14171a] relative shrink-0 w-full">
              <div className="flex flex-col items-center relative size-full">
                <div className="w-full h-[969px]">
                  <EsriFireMap className="w-full h-full rounded" />
                </div>
              </div>
            </div>

            {/* Map Time Controls */}
            <div className="hidden bg-[#14171a] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[12px] relative shrink-0 w-full">
              <div className="h-11 relative shadow-[0px_1px_2px_0px_rgba(16,40,34,0.05)] shrink-0 w-full">
                <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
                  <div className="box-border content-stretch flex flex-row gap-1 h-11 items-center justify-center px-2 py-2.5 relative w-full">
                    <div
                      className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      <p className="block leading-[24px] whitespace-pre">
                        Fire progression time interval
                      </p>
                    </div>
                    <div className="relative shrink-0 size-6">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 19.275C11.5833 19.275 11.2293 19.129 10.938 18.837C10.646 18.5457 10.5 18.1917 10.5 17.775C10.5 17.3583 10.646 17.004 10.938 16.712C11.2293 16.4207 11.5833 16.275 12 16.275C12.4167 16.275 12.7707 16.4207 13.062 16.712C13.354 17.004 13.5 17.3583 13.5 17.775C13.5 18.1917 13.354 18.5457 13.062 18.837C12.7707 19.129 12.4167 19.275 12 19.275ZM12 13.5C11.5833 13.5 11.2293 13.354 10.938 13.062C10.646 12.7707 10.5 12.4167 10.5 12C10.5 11.5833 10.646 11.2293 10.938 10.938C11.2293 10.646 11.5833 10.5 12 10.5C12.4167 10.5 12.7707 10.646 13.062 10.938C13.354 11.2293 13.5 11.5833 13.5 12C13.5 12.4167 13.354 12.7707 13.062 13.062C12.7707 13.354 12.4167 13.5 12 13.5ZM12 7.725C11.5833 7.725 11.2293 7.579 10.938 7.287C10.646 6.99567 10.5 6.64167 10.5 6.225C10.5 5.80833 10.646 5.454 10.938 5.162C11.2293 4.87067 11.5833 4.725 12 4.725C12.4167 4.725 12.7707 4.87067 13.062 5.162C13.354 5.454 13.5 5.80833 13.5 6.225C13.5 6.64167 13.354 6.99567 13.062 7.287C12.7707 7.579 12.4167 7.725 12 7.725Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Controls */}
              <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[8px] relative rounded shrink-0">
                  <div className="relative shrink-0 size-5">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.27083 14.7083L4.5625 10L9.27083 5.29167L10.1458 6.16667L6.33333 10L10.1458 13.8333L9.27083 14.7083ZM14.5625 14.7083L9.85417 10L14.5625 5.29167L15.4375 6.16667L11.625 10L15.4375 13.8333L14.5625 14.7083Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div
                    className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    <p className="block leading-[20px] whitespace-pre">
                      Backward
                    </p>
                  </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[10px] relative rounded shrink-0">
                  <div className="relative shrink-0 size-6">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8.5 18.1V5.9L18.075 12L8.5 18.1ZM10 15.35L15.275 12L10 8.65V15.35Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div
                    className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    <p className="block leading-[24px] whitespace-pre">
                      Play
                    </p>
                  </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-[8px] relative rounded shrink-0">
                  <div
                    className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    <p className="block leading-[20px] whitespace-pre">
                      Forward
                    </p>
                  </div>
                  <div className="relative shrink-0 size-5">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5.47917 15.625L9.5 10L5.47917 4.375H7L11.0208 10L7 15.625H5.47917ZM10.375 15.625L14.3958 10L10.375 4.375H11.8958L15.9167 10L11.8958 15.625H10.375Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time Slider */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
                <div className="h-[53px] relative rounded-lg w-full">
                  <div className="absolute bg-[#353a40] h-2 left-0 right-[0.42px] rounded top-2" />
                  <div className="absolute bg-[#01669f] h-2 left-0 right-[160.42px] rounded top-2" />
                  <div className="absolute right-[148.42px] size-6 top-0">
                    <div className="absolute inset-[-8.33%_-25%_-41.67%_-25%]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="14"
                          fill="white"
                          r="12"
                        />
                        <circle
                          cx="18"
                          cy="14"
                          r="11.5"
                          stroke="#01669F"
                        />
                      </svg>
                    </div>
                    <div
                      className="absolute flex flex-col font-['Open_Sans:SemiBold',_sans-serif] font-semibold justify-center leading-[0] left-1/2 text-[#ffffff] text-[14px] text-center text-nowrap top-10 translate-x-[-50%] translate-y-[-50%]"
                      style={{
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      <p className="block leading-[20px] whitespace-pre">
                        08:00 8 Aug 2025
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold text-[#afb5bc] text-[14px] text-center absolute left-6 top-6"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  <p className="leading-[20px]">
                    <span>0 </span>
                    <span className="font-['Open_Sans:Bold',_sans-serif] font-bold">
                      hr
                    </span>
                  </p>
                </div>
                <div
                  className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold text-[#afb5bc] text-[14px] text-center absolute right-6 top-6"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  <p className="leading-[20px]">
                    <span>168 </span>
                    <span className="font-['Open_Sans:Bold',_sans-serif] font-bold">
                      hr
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Control Panel */}
          <div className="h-full overflow-x-clip overflow-y-auto relative rounded shrink-0 w-[710px]">
            {/* Objectives Card (now on right side, above controls) */}
            <div className="absolute left-0 top-0 w-[710px] z-0">
              <div className="bg-card/95 border border-border rounded-md p-4 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-foreground text-[17px] font-semibold">Objectives</h3>
                </div>
                <div className="space-y-4">
                  {/* Objective 1 */}
                  <div className="bg-white/5 rounded-md p-3">
                    <div className="text-base font-semibold text-foreground mb-2">Disable all power lines.</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'ongoing', title: 'De-energize critical feeders serving Lahaina', resources: ['Utility Liaison', 'SCADA Operator', 'Field Line Crew'], projectedOutcome: 'Reduce ignition risk and improve responder safety; initial de-energization within 30–60 minutes.', rationale: 'High winds and active fire increase arcing risk. Remote sectionalizing possible; confirm in field.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-xs">Ongoing</span>
                        <span className="text-sm text-foreground">De-energize critical feeders serving Lahaina</span>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'ongoing', title: 'Establish Lockout/Tagout (LOTO) on opened circuits', resources: ['2 Line Crews', 'LOTO Kits', 'Dispatch Confirmation'], projectedOutcome: 'Prevent inadvertent re-energization; eliminate backfeed hazards to crews and public.', rationale: 'Apply LOTO at switches, reclosers, and substation breakers; verify with control center.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-xs">Ongoing</span>
                        <span className="text-sm text-foreground">Establish Lockout/Tagout (LOTO) on opened circuits</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'recommended', title: 'Open reclosers and isolate Lahaina substation feeders', resources: ['2 Line Crews', 'Bucket Truck', 'Access Keys'], projectedOutcome: 'Isolate the affected area and prevent automatic reclosing during the incident.', rationale: 'Manual open at field reclosers; confirm isolation via SCADA and field verification.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#38b7fe]/15 text-[#38b7fe] text-xs">Recommended</span>
                        <span className="text-sm text-foreground">Open reclosers and isolate Lahaina substation feeders</span>
                      </div>
                    </div>
                  </div>

                  {/* Objective 2 */}
                  <div className="bg-white/5 rounded-md p-3">
                    <div className="text-base font-semibold text-foreground mb-2">Evacuate victims from Wahikuli Terrace.</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'ongoing', title: 'Door-to-door evacuation sweep with LE support', resources: ['4 LE Units', '2 EMS', 'Evac Vans'], projectedOutcome: 'Complete evac sweep in 60–90 mins.', rationale: 'Bilingual teams coordinating with shelter intake; priority for mobility-impaired.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-xs">Ongoing</span>
                        <span className="text-sm text-foreground">Door-to-door evacuation sweep with LE support</span>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'ongoing', title: 'Stage transport at Lahaina Civic Center', resources: ['3 Buses', 'Traffic Control'], projectedOutcome: 'Reduce load time; improve evac throughput.', rationale: 'Buses staging in loop; traffic managed at entry/exit.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-xs">Ongoing</span>
                        <span className="text-sm text-foreground">Stage transport at Lahaina Civic Center</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:ring-1 hover:ring-white/15 transition-colors" onClick={() => setObjectiveModal({ type: 'recommended', title: 'Open additional evacuation route via Honoapiʻilani Hwy', resources: ['Road Crew', 'LE Units', 'Signage'], projectedOutcome: 'Faster clearance of neighborhood; reduced congestion.', rationale: 'Coordinate with DOT; set contraflow if needed.' })}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#38b7fe]/15 text-[#38b7fe] text-xs">Recommended</span>
                        <span className="text-sm text-foreground">Open additional evacuation route via Honoapiʻilani Hwy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Controls removed as requested */}

            {/* Fire Hazard Analysis */}
            <div className="absolute z-10 h-[170px] left-0 top-[464px] w-[710px]">
              <div className="absolute bg-[#14171a] box-border content-stretch flex flex-row gap-2 items-center justify-start left-0 px-4 py-1 top-0 w-[710px]">
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
                  <div
                    className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                    }}
                  >
                    <p className="block leading-[24px] whitespace-pre">{selectedTab === "outage" ? "Outage Analysis" : "Fire Hazard Analysis"}</p>
                  </div>
                </div>
                <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                  <div className="basis-0 grow h-full min-h-px min-w-px shrink-0" />
                </div>
                <div className="relative shrink-0 size-5">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M5.25 16.25C4.83333 16.25 4.47917 16.1042 4.1875 15.8125C3.89583 15.5208 3.75 15.1667 3.75 14.75V12.5H5V14.75C5 14.8056 5.02778 14.8611 5.08333 14.9167C5.13889 14.9722 5.19444 15 5.25 15H14.75C14.8056 15 14.8611 14.9722 14.9167 14.9167C14.9722 14.8611 15 14.8056 15 14.75V12.5H16.25V14.75C16.25 15.1667 16.1042 15.5208 15.8125 15.8125C15.5208 16.1042 15.1667 16.25 14.75 16.25H5.25ZM10 13.0208L6.4375 9.45833L7.3125 8.54167L9.375 10.6042V3.60417H10.625V10.6042L12.6875 8.54167L13.5625 9.45833L10 13.0208Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              {/* Table Data */}
              <div className="absolute bg-[#14171a] box-border content-stretch flex flex-col gap-3 items-start justify-start left-0 p-4 pt-7 top-7 w-[710px]">
                {/* Header Row */}
                <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0" style={{ width: LABEL_COL_WIDTH }}>
                    <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-right uppercase">
                      <p className="block leading-[18px] whitespace-pre">
                        HAZARD
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                        <p className="block leading-[18px] whitespace-pre">
                          DAY 1
                        </p>
                      </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                        <p className="block leading-[18px] whitespace-pre">
                          DAY 2
                        </p>
                      </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                        <p className="block leading-[18px] whitespace-pre">
                          DAY 3
                        </p>
                      </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                        <p className="block leading-[18px] whitespace-pre">
                          DAY 4
                        </p>
                      </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                      <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                        <p className="block leading-[18px] whitespace-pre">
                          DAY 5
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fire Ignition / Outage Probability Row (formerly Embers) */}
                  <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0" style={{ width: LABEL_COL_WIDTH }}>
                    <div className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap" style={{fontVariationSettings: "'wdth' 100"}}>
                      <p className="block leading-[20px] whitespace-pre">{selectedTab === 'outage' ? 'Outage Probability' : 'Fire Ignition'}</p>
                    </div>
                  </div>
                  <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    {[0, 1, 2, 3, 4].map((dayIndex) => (
                      <div key={dayIndex} className="box-border content-stretch flex flex-row flex-nowrap gap-1 items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                        {(currentRiskData["Embers"]?.[dayIndex] || []).map((color, pillIndex) => (
                          <TooltipProvider key={`${dayIndex}-${pillIndex}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  style={{ backgroundColor: color }}
                                  className="h-6 w-[6px] rounded-[5px]"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <div className="font-semibold mb-1">{selectedTab === 'outage' ? 'Outage Probability' : 'Fire Ignition'} — DAY {dayIndex + 1}</div>
                                  <div>Ignition Component (IC): {getIgnitionComponentFromColor(color)}</div>
                                  <div>Block: {threeHourBlocks[pillIndex % threeHourBlocks.length]}</div>
                                  <div>Date: {formatDayDate(dayIndex)}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wind Risk / Residents Impacted Row (formerly Fire Perimeters) */}
                <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0" style={{ width: LABEL_COL_WIDTH }}>
                    <div className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap" style={{fontVariationSettings: "'wdth' 100"}}>
                      <p className="block leading-[20px] whitespace-pre">{selectedTab === 'outage' ? 'Residents Impacted' : 'Wind Risk'}</p>
                    </div>
                  </div>
                  <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    {[0, 1, 2, 3, 4].map((dayIndex) => (
                      <div key={dayIndex} className="box-border content-stretch flex flex-row flex-nowrap gap-1 items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                        {(currentRiskData["Fire Perimeters"]?.[dayIndex] || []).map((color, pillIndex) => (
                          <TooltipProvider key={`${dayIndex}-${pillIndex}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  style={{ backgroundColor: color }}
                                  className="h-6 w-[6px] rounded-[5px]"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <div className="font-semibold mb-1">{selectedTab === 'outage' ? 'Residents Impacted' : 'Wind Risk'} — DAY {dayIndex + 1}</div>
                                  <div>{getRateOfSpreadFromColor(color)}</div>
                                  <div>Block: {threeHourBlocks[pillIndex % threeHourBlocks.length]}</div>
                                  <div>Date: {formatDayDate(dayIndex)}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Containment Row removed */}
              </div>
            </div>

            {/* Peak System Table */}
            <div className="absolute z-10 h-[350px] left-0 top-[654px] w-[710px]">
              {/* Peak System Table Title */}
              <div className="bg-[#14171a] relative z-20 shrink-0 w-full">
                <div className="flex flex-row items-center relative size-full">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-3 relative w-full">
                    <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
                      <div
                        className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
                        style={{
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        <p className="block leading-[24px] whitespace-pre mt-1">{selectedTab === 'outage' ? 'Outage Scenarios' : 'Ember Spread Scenarios'}</p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 grow h-full min-h-px min-w-px shrink-0" />
                    </div>
                    <div className="relative shrink-0 size-5">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d={svgPaths.p1d2d6000}
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bg-[#14171a] box-border content-stretch flex flex-col gap-3 items-start justify-start left-0 p-4 pt-7 top-7 w-[710px] z-10">
                {/* Header */}
                <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0" style={{ width: LABEL_COL_WIDTH }}>
                    <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-right uppercase">
                      <p className="block leading-[18px] whitespace-pre">
                        SCENARIO
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    {PEAK_DAY_INDEXES.map((dayIndex) => (
                      <div key={dayIndex} className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                        <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#afb5bc] text-[10px] text-nowrap text-center uppercase">
                          <p className="block leading-[18px] whitespace-pre">{`DAY ${dayIndex + 1}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scenario Rows */}
                {currentPeakData.scenarios.map((scenario: { name: string; values: string[] }) => (
                  <React.Fragment key={scenario.name}>
                    <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full">
                      <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0" style={{ width: LABEL_COL_WIDTH }}>
                        <div className="flex items-center gap-1">
                          <div className="relative shrink-0 size-5">
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d={svgPaths.pb72ca50}
                                fill="white"
                              />
                            </svg>
                          </div>
                          <div className="font-['Open_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap" style={{fontVariationSettings: "'wdth' 100"}}>
                            <p className="block leading-[20px] whitespace-pre">
                              {scenario.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                        {scenario.values.slice(0, 5).map((value: string, valueIndex: number) => {
                          const cellConfig = getCellConfig(selectedHazard, scenario.name, valueIndex);
                          return (
                            <div key={valueIndex} className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      style={{
                                        backgroundColor: getCellColor(value, selectedHazard),
                                        width: (cellConfig.width * 1.2) + "px",
                                        height: (cellConfig.height * 0.7) + "px",
                                      }}
                                      className="flex items-center justify-center rounded-[5px]"
                                    >
                                      <div
                                        className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-center text-nowrap"
                                        style={{
                                          fontSize: `${cellConfig.fontSize}px`,
                                          fontVariationSettings: "'wdth' 100",
                                        }}
                                      >
                                        <p className="block leading-none whitespace-pre">{formatRos(value, selectedHazard)}</p>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs">
                                      <div className="font-semibold mb-1">{selectedHazard} — DAY {valueIndex + 1}</div>
                                      <div>{selectedTab === 'outage' ? '% Without Power' : 'ROS'}: {formatRos(value, selectedHazard)}</div>
                                      <div>Time Range: All-day</div>
                                      <div>Probability: {scenario.name}</div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          );
                        })}
                      </div>
                      {/* Expand/Collapse trigger on scenario label */}
                      <div className="absolute left-0 top-0 h-full cursor-pointer" style={{ width: LABEL_COL_WIDTH }} onClick={() => toggleScenarioExpanded(scenario.name)} aria-hidden />
                    </div>
                    {/* Animated child rows container */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        expandedScenarioNames[scenario.name]
                          ? 'max-h-[600px] opacity-100 translate-y-0'
                          : 'max-h-0 opacity-0 -translate-y-1'
                      }`}
                      aria-hidden={!expandedScenarioNames[scenario.name]}
                    >
                      {generateChildRows(scenario).map((child, childIdx) => (
                        <div key={`${scenario.name}-child-${childIdx}`} className="box-border content-stretch flex flex-row items-center justify-start relative shrink-0 w-full rounded-md bg-white/5 transition-colors hover:bg-white/7">
                          <div className="box-border content-stretch flex flex-row items-center justify-start relative shrink-0 pl-4" style={{ width: LABEL_COL_WIDTH }}>
                            <div className="font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#afb5bc] text-[12px] text-left text-nowrap" style={{fontVariationSettings: "'wdth' 100"}}>
                              <p className="block leading-[18px] whitespace-pre">{child.name}</p>
                            </div>
                          </div>
                          <div className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                            {child.values.slice(0, 5).map((val, di) => (
                              <div key={di} className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0" style={{ width: DAY_COL_WIDTH }}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                      style={{
                                        backgroundColor: getCellColor(val, selectedHazard),
                                        width: 72,
                                        height: 20,
                                      }}
                                        className="flex items-center justify-center rounded-[5px]"
                                      >
                                        <div
                                          className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-center text-nowrap"
                                          style={{ fontSize: 12, fontVariationSettings: "'wdth' 100" }}
                                        >
                                          <p className="block leading-none whitespace-pre">{formatRos(val, selectedHazard)}</p>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        <div className="font-semibold mb-1">{child.name} — DAY {di + 1}</div>
                                        <div>{selectedTab === 'outage' ? '% Without Power' : 'ROS'}: {formatRos(val, selectedHazard)}</div>
                                        <div>Time Range: All-day</div>
                                        <div>Probability: {scenario.name}</div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Legend removed as per request */}
          </div>
        </div>
      </div>

      {/* Ask PRATUS response panel */}
      {isAskPratusResponseOpen && (
        <div className="absolute left-1/2 top-20 z-[60] w-[720px] max-w-[90vw] -translate-x-1/2">
          <div className="bg-card/95 border border-border rounded-xl shadow-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">PRATUS</div>
                <div className="text-base leading-relaxed text-foreground">
                  Based on current staging, the following resources can be dispatched to Front Street within the next operational hour:
                  <ul className="list-disc ml-5 mt-2">
                    <li>2 Engine Companies — structure protection and initial attack</li>
                    <li>1 Ladder Truck — elevated streams and overwatch</li>
                    <li>1 Water Tender — sustained water supply support</li>
                    <li>Road Crew + Traffic Control — route management and safety</li>
                  </ul>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setIsAskPratusResponseOpen(false)}>Close</Button>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Template Action Request</div>
              <Textarea
                rows={5}
                value={askPratusActionRequest}
                onChange={(e) => setAskPratusActionRequest(e.target.value)}
                className="bg-white/5"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAskPratusResponseOpen(false)}>Cancel</Button>
              <Button onClick={() => { setIsAskPratusResponseOpen(false); }}>Submit Request</Button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-card text-foreground border border-border rounded-xl w-[860px] max-w-[95vw] p-6 shadow-2xl">
            {/* Header uses action title */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <Input
                  value={actionModal.title}
                  onChange={(e) => setActionModal({ ...actionModal, title: e.target.value })}
                  className="text-xl font-semibold leading-tight tracking-tight bg-white/5"
                />
              </div>
              <Button variant="ghost" onClick={() => setActionModal(null)}>Close</Button>
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Rationale</div>
                <Textarea
                  value={actionModal.why}
                  onChange={(e) => setActionModal({ ...actionModal, why: e.target.value })}
                  rows={3}
                  className="text-sm bg-transparent"
                />
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">ETA</div>
                <Input
                  value={actionModal.eta}
                  onChange={(e) => setActionModal({ ...actionModal, eta: e.target.value })}
                  className="text-sm font-medium bg-transparent"
                />
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Projected Outcome</div>
                <Textarea
                  rows={3}
                  value={actionModal.projectedOutcome}
                  onChange={(e) => setActionModal({ ...actionModal, projectedOutcome: e.target.value })}
                  className="text-sm bg-transparent"
                />
              </div>
            </div>

            {/* Resources as clickable, expandable pills */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Resources</div>
              <div className="flex flex-wrap gap-2">
                {actionModal.resources.map((res, i) => (
                  <details key={`${res}-${i}`} className="group">
                    <summary className="cursor-pointer list-none">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs hover:bg-secondary/70 transition-colors">
                        <span className="inline-block size-1.5 rounded-full bg-primary/80" />
                        {res}
                      </span>
                    </summary>
                    <div className="mt-2 ml-1 text-xs text-muted-foreground bg.white/5 rounded-md p-3 max-w-[520px] space-y-1">
                      <div><span className="font-medium text-foreground">Current Location:</span> {i % 2 === 0 ? 'Lahaina Heliport' : 'Central Depot'}</div>
                      <div><span className="font-medium text-foreground">Miles from Destination:</span> {i % 2 === 0 ? '3.2 mi' : '5.6 mi'}</div>
                      <div><span className="font-medium text-foreground">Status:</span> {i % 2 === 0 ? 'Ready' : 'En route'}</div>
                      <div className="mt-2"><span className="font-medium text-foreground">Details:</span> Availability good; deployment path clear.</div>
                      <div><span className="font-medium text-foreground">Supervisor:</span> Assigned and notified.</div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Aligned Objective */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Aligned Objective</div>
              <div className="bg-white/5 rounded-md p-3 text-sm">
                <Textarea
                  rows={3}
                  value={actionModal.alignedObjective}
                  onChange={(e) => setActionModal({ ...actionModal, alignedObjective: e.target.value })}
                  className="bg-transparent"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
              {!actionSubmitted ? (
                <Button onClick={() => { setActionSubmitted(true); }}>Execute</Button>
              ) : (
                <Button onClick={() => { if (actionModal) setRecommendedActions(prev => prev.filter(a => a.id === undefined ? true : a.id !== actionModal.id)); setActionModal(null); }}>Close</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Objective Action Modal (ongoing/recommended) */}
      {objectiveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-card text-foreground border border-border rounded-xl w-[760px] max-w-[95vw] p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${objectiveModal.type === 'recommended' ? 'bg-[#38b7fe]/15 text-[#38b7fe]' : 'bg-white/10'}`}>
                  {objectiveModal.type === 'recommended' ? 'Recommended' : 'Ongoing'}
                </span>
                <h3 className="text-lg font-semibold leading-tight tracking-tight">{objectiveModal.title}</h3>
              </div>
              <Button variant="ghost" onClick={() => setObjectiveModal(null)}>Close</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Resources Required</div>
                <div className="text-sm space-y-1">
                  {objectiveModal.resources.map((r, i) => (
                    <div key={`${r}-${i}`} className="flex items-center gap-2">
                      <span className="inline-block size-1.5 rounded-full bg-primary/80" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Projected Outcome</div>
                <div className="text-sm">{objectiveModal.projectedOutcome}</div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Rationale</div>
                <div className="text-sm">{objectiveModal.rationale}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {objectiveModal.type === 'recommended' ? (
                <>
                  <Button variant="outline" onClick={() => setObjectiveModal(null)}>Close</Button>
                  <Button onClick={() => setObjectiveModal(null)}>Submit Request</Button>
                </>
              ) : (
                <>
                  <Button variant="destructive" onClick={() => setObjectiveModal(null)}>Send Stop Request</Button>
                  <Button variant="outline" onClick={() => setObjectiveModal(null)}>Cancel</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}