const TimelineLegend = () => {
  return (
    <div className="flex flex-wrap justify-end gap-4 items-center pt-4 border-t">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ea384c]"></div>
        <span className="text-xs">High Priority</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
        <span className="text-xs">Medium Priority</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#33C3F0]"></div>
        <span className="text-xs">Low Priority</span>
      </div>
    </div>
  );
};

export default TimelineLegend;