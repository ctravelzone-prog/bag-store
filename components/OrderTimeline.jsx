import { IconCheck } from './Icons';
export const FLOW = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];
export default function OrderTimeline({ status, history = [] }) {
  if (status === 'Cancelled' || status === 'Returned') {
    return (<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm"><p className="font-bold text-red-700">Order {status}</p><p className="text-gray-600 mt-1">This order was {status.toLowerCase()}. Stock was restored to the shop.</p></div>);
  }
  const idx = FLOW.indexOf(status);
  return (
    <ol className="flex flex-wrap gap-2 mt-3">
      {FLOW.map((s, i) => {
        const done = i <= idx;
        const hist = history.find(h => h.status === s);
        return (<li key={s} className={'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border ' + (done ? 'bg-maroon text-white border-maroon' : 'bg-white text-gray-500')}>
          <span className={'w-5 h-5 rounded-full flex items-center justify-center ' + (done ? 'bg-gold text-black' : 'bg-gray-200')}>{done ? <IconCheck size={12} /> : i + 1}</span>
          {s}{hist && <span className="font-normal opacity-80">{new Date(hist.at).toLocaleDateString()}</span>}
        </li>);
      })}
    </ol>
  );
}
