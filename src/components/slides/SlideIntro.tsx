import { WrappedData } from "@/types/wrapped";
import { FireIcon, BoltIcon } from "@heroicons/react/24/outline";

export default function SlideIntro({ data }: { data: WrappedData }) {
  const gasValue = parseFloat(data.summary.total_gas_usd);
  const showGas = gasValue > 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in duration-500">
      
      <div className="space-y-1">
        <h2 className="font-heading text-3xl text-slate-900 uppercase">2024 At A Glance</h2>
        <p className="text-slate-500 font-medium">You were busy this year.</p>
      </div>

      <div className="w-full space-y-4">
        {/* Transaction Stat */}
        <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-[#B1E4E3] rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <BoltIcon className="w-6 h-6 text-slate-900" />
             </div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
               Total<br/>Transactions
             </span>
          </div>
          <span className="font-heading text-4xl text-slate-900">
            {data.summary.total_tx.toLocaleString()}
          </span>
        </div>

        {/* Gas Stat */}
        {showGas && (
          <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-orange-200 rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <FireIcon className="w-6 h-6 text-slate-900" />
               </div>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                 Gas<br/>Burned
               </span>
            </div>
            <span className="font-heading text-3xl text-slate-900">
              ${data.summary.total_gas_usd}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}