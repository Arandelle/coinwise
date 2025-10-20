import { MapPin, Mail, MapPinned } from "lucide-react";

export default function ProfileCard() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/** Header image */}
        <section className="h-48 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
          </div>
        </section>

        {/**Profile picture */}
        <section className="relative px-6">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl font-semibold">
                AP
              </div>
            </div>
          </div>
        </section>

        {/** Profile info */}
        <section className="pt-20 pb-6 px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Arandelle Paguinto
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Designer, cat lover, bookworm apple pie fanatic <br />
            and nature enthusiast.
          </p>

          {/**Other Details */}
          <div className="flex items-center justify-center gap-6 mb-6 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Hungary</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Send E-mail</span>
            </div>
          </div>

          {/** Stats */}
          <div className="flex border-t border-b border-slate-200">
            <div className="flex-1 py-4 border-r border-slate-200">
              <div className="text-2xl font-bold text-slate-800">8,100</div>
              <div className="text-sm text-slate-500">Followers</div>
            </div>
            <div className="flex-1 py-4">
              <div className="text-2xl font-bold text-slate-800">6,650</div>
              <div className="text-sm text-slate-500">Following</div>
            </div>
          </div>

          <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
            Follow
          </button>
        </section>
      </div>
    </section>
  );
}
