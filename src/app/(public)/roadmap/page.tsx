"use client"
import React, { ComponentType, CSSProperties, ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, Database, Brain, Users, Trophy, TrendingUp, Bell, Lock } from 'lucide-react';

interface FlowchartSection {
    title: string,
    icon: ComponentType<{size?: number, style: CSSProperties}>,
    color: string,
    children: ReactNode,
    defaultOpen?: boolean
}

interface FlowBox {
    children: ReactNode,
    color: string,
    className?: string
}


const FlowchartSection = ({ title, icon: Icon, color, children, defaultOpen = false } : FlowchartSection) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4 border-2 rounded-lg overflow-hidden" style={{ borderColor: color }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        style={{ backgroundColor: `${color}15` }}
      >
        <div className="flex items-center gap-3">
          <Icon size={24} style={{ color }} />
          <span className="font-bold text-lg" style={{ color }}>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const FlowBox = ({ children, color = "#3b82f6", className = "" } : FlowBox) => (
  <div 
    className={`p-3 rounded-lg border-2 shadow-sm ${className}`}
    style={{ borderColor: color, backgroundColor: `${color}10` }}
  >
    {children}
  </div>
);

const Arrow = ({ vertical = false }) => (
  <div className={`flex items-center justify-center ${vertical ? 'my-2' : 'mx-2'}`}>
    <div className={`${vertical ? 'border-l-2' : 'border-t-2'} border-gray-400 ${vertical ? 'h-8' : 'w-8'}`}></div>
    <div className={`${vertical ? 'border-b-4 border-l-4' : 'border-r-4 border-t-4'} border-gray-400 w-3 h-3 ${vertical ? 'rotate-45 -mt-2' : 'rotate-45 -ml-2'}`}></div>
  </div>
);

export default function CoinwiseFlowchart() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💰 Coinwise Architecture</h1>
        <p className="text-lg text-gray-600">AI-Powered Finance & Expense Tracker</p>
        <p className="text-sm text-gray-500 mt-2">Manual tracking • AI insights • No bank access required</p>
      </div>

      {/* Database Layer */}
      <FlowchartSection title="Database Layer (MongoDB)" icon={Database} color="#10b981" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">👤 Users Collection</div>
            <div className="text-sm space-y-1">
              <div>• user_id (PK)</div>
              <div>• email, password_hash</div>
              <div>• profile (name, avatar)</div>
              <div>• created_at, updated_at</div>
              <div>• settings (theme, currency)</div>
              <div>• gamification (xp, level, streak)</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">💸 Transactions Collection</div>
            <div className="text-sm space-y-1">
              <div>• transaction_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• type (income/expense)</div>
              <div>• amount, currency</div>
              <div>• category_id (FK)</div>
              <div>• description, date</div>
              <div>• created_at, updated_at</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">📂 Categories Collection</div>
            <div className="text-sm space-y-1">
              <div>• category_id (PK)</div>
              <div>• name (Food, Transport, etc.)</div>
              <div>• icon, color</div>
              <div>• type (expense/income)</div>
              <div>• is_custom (boolean)</div>
              <div>• user_id (null for default)</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">🎯 Goals Collection</div>
            <div className="text-sm space-y-1">
              <div>• goal_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• target_amount</div>
              <div>• current_amount</div>
              <div>• deadline, status</div>
              <div>• created_at, updated_at</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">🏆 Achievements Collection</div>
            <div className="text-sm space-y-1">
              <div>• achievement_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• badge_name, badge_type</div>
              <div>• unlocked_at</div>
              <div>• progress (0-100%)</div>
              <div>• xp_reward</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">🎮 Challenges Collection</div>
            <div className="text-sm space-y-1">
              <div>• challenge_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• title, description</div>
              <div>• type (daily/weekly)</div>
              <div>• status (active/completed)</div>
              <div>• start_date, end_date</div>
              <div>• xp_reward</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">💡 AI_Insights Collection</div>
            <div className="text-sm space-y-1">
              <div>• insight_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• type (tip/forecast/alert)</div>
              <div>• content (text)</div>
              <div>• priority (low/medium/high)</div>
              <div>• is_read (boolean)</div>
              <div>• created_at</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">💬 Chat_History Collection</div>
            <div className="text-sm space-y-1">
              <div>• message_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• role (user/assistant)</div>
              <div>• content</div>
              <div>• timestamp</div>
              <div>• context_data (JSON)</div>
            </div>
          </FlowBox>

          <FlowBox color="#10b981">
            <div className="font-semibold mb-2">📊 Budgets Collection</div>
            <div className="text-sm space-y-1">
              <div>• budget_id (PK)</div>
              <div>• user_id (FK)</div>
              <div>• category_id (FK)</div>
              <div>• limit_amount</div>
              <div>• spent_amount</div>
              <div>• period (monthly/weekly)</div>
              <div>• start_date, end_date</div>
            </div>
          </FlowBox>
        </div>
      </FlowchartSection>

      {/* Core Features Flow */}
      <FlowchartSection title="1. Core Features Flow" icon={TrendingUp} color="#3b82f6" defaultOpen={true}>
        <div className="space-y-4">
          <FlowBox color="#3b82f6">
            <div className="font-semibold mb-2">User Authentication</div>
            <div className="text-sm">Login/Signup → JWT Token → Access Dashboard</div>
          </FlowBox>
          
          <Arrow vertical />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlowBox color="#3b82f6">
              <div className="font-semibold mb-2">📝 Manual Transactions</div>
              <div className="text-sm space-y-1">
                <div>1. User adds transaction</div>
                <div>2. Select category</div>
                <div>3. Enter amount & date</div>
                <div>4. Save to MongoDB</div>
                <div>5. Update analytics</div>
                <div>6. Check challenges/goals</div>
              </div>
            </FlowBox>

            <FlowBox color="#3b82f6">
              <div className="font-semibold mb-2">📊 Analytics Dashboard</div>
              <div className="text-sm space-y-1">
                <div>• Query transactions by date</div>
                <div>• Aggregate by category</div>
                <div>• Generate pie chart</div>
                <div>• Display spending trend</div>
                <div>• Show income vs expense</div>
                <div>• Calculate savings rate</div>
              </div>
            </FlowBox>

            <FlowBox color="#3b82f6">
              <div className="font-semibold mb-2">🎯 Savings Goals</div>
              <div className="text-sm space-y-1">
                <div>1. Set target amount</div>
                <div>2. Set deadline</div>
                <div>3. Track progress bar</div>
                <div>4. Show remaining amount</div>
                <div>5. AI suggests savings plan</div>
                <div>6. Celebrate on completion</div>
              </div>
            </FlowBox>
          </div>
        </div>
      </FlowchartSection>

      {/* AI Features Flow */}
      <FlowchartSection title="2. AI Features Flow (FastAPI + LangChain)" icon={Brain} color="#8b5cf6">
        <div className="space-y-4">
          <FlowBox color="#8b5cf6">
            <div className="font-semibold mb-2">🧠 AI Processing Pipeline</div>
            <div className="text-sm">
              User Input → FastAPI Backend → LangChain Agent → MongoDB Query → AI Analysis → Response
            </div>
          </FlowBox>

          <Arrow vertical />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlowBox color="#8b5cf6">
              <div className="font-semibold mb-2">💬 AI Coach Chat</div>
              <div className="text-sm space-y-1">
                <div>1. User asks question</div>
                <div>2. LangChain parses intent</div>
                <div>3. Query relevant data</div>
                <div>4. Generate contextual response</div>
                <div>5. Save to chat history</div>
                <div className="mt-2 text-xs text-purple-700">
                  Examples:<br/>
                  {`"How much on dining?"`}<br/>
                  {`"Create savings plan"`}
                </div>
              </div>
            </FlowBox>

            <FlowBox color="#8b5cf6">
              <div className="font-semibold mb-2">📊 AI Insights (Auto)</div>
              <div className="text-sm space-y-1">
                <div>1. Scheduled job (daily/weekly)</div>
                <div>2. Analyze spending patterns</div>
                <div>3. Compare with history</div>
                <div>4. Generate insights</div>
                <div>5. Store in AI_Insights</div>
                <div>6. Notify user</div>
                <div className="mt-2 text-xs text-purple-700">
                  {`"You spent ₱500 more`}<br/>
                  {`on food than last week"`}
                </div>
              </div>
            </FlowBox>

            <FlowBox color="#8b5cf6">
              <div className="font-semibold mb-2">💡 AI Recommendations</div>
              <div className="text-sm space-y-1">
                <div>1. Analyze budget vs actual</div>
                <div>2. Identify overspending</div>
                <div>3. ML prediction model</div>
                <div>4. Generate suggestions</div>
                <div>5. Optimize budget allocation</div>
                <div className="mt-2 text-xs text-purple-700">
                  {`"Reduce dining by 10%`}<br/>
                  {`to reach goal faster"`}
                </div>
              </div>
            </FlowBox>
          </div>

          <Arrow vertical />

          <FlowBox color="#8b5cf6">
            <div className="font-semibold mb-2">🔮 Future ML Enhancements</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
              <div>• Spending pattern prediction</div>
              <div>• Budget forecasting</div>
              <div>• Anomaly detection (unusual spending)</div>
              <div>• Goal optimizer algorithm</div>
              <div>• Trend analysis & seasonality</div>
              <div>• Personalized tips engine</div>
            </div>
          </FlowBox>
        </div>
      </FlowchartSection>

      {/* Gamification Flow */}
      <FlowchartSection title="3. Gamification System Flow" icon={Trophy} color="#f59e0b">
        <div className="space-y-4">
          <FlowBox color="#f59e0b">
            <div className="font-semibold mb-2">🎮 Gamification Engine</div>
            <div className="text-sm">
              User Action → Check Rules → Award XP → Update Level → Unlock Badges → Notify User
            </div>
          </FlowBox>

          <Arrow vertical />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlowBox color="#f59e0b">
              <div className="font-semibold mb-2">🏆 Daily/Weekly Challenges</div>
              <div className="text-sm space-y-1">
                <div>1. Generate challenges</div>
                <div>2. Display in dashboard</div>
                <div>3. Track completion</div>
                <div>4. Award XP on success</div>
                <div className="mt-2 text-xs text-amber-700">
                  {`"Spend ₱0 on takeout"`}<br/>
                  {`"Save ₱200 this week"`}<br/>
                  {`"Log 7 days in a row"`}
                </div>
              </div>
            </FlowBox>

            <FlowBox color="#f59e0b">
              <div className="font-semibold mb-2">⚡ XP & Streaks System</div>
              <div className="text-sm space-y-1">
                <div>• +10 XP per transaction</div>
                <div>• +20 XP per challenge</div>
                <div>• +50 XP per achievement</div>
                <div>• Streak counter (days)</div>
                <div>• Level up every 100 XP</div>
                <div>• Progress bar visualization</div>
              </div>
            </FlowBox>

            <FlowBox color="#f59e0b">
              <div className="font-semibold mb-2">🎖️ Achievement Badges</div>
              <div className="text-sm space-y-1">
                <div>• Budget Beginner (7 days)</div>
                <div>• Ipon Master (₱5K saved)</div>
                <div>• Mindful Spender (3 weeks)</div>
                <div>• Category Champion</div>
                <div>• Goal Crusher</div>
                <div>• Streak Master (30 days)</div>
              </div>
            </FlowBox>
          </div>
        </div>
      </FlowchartSection>

      {/* Visualization Flow */}
      <FlowchartSection title="4. Smart Visualization & Customization" icon={TrendingUp} color="#ec4899">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FlowBox color="#ec4899">
            <div className="font-semibold mb-2">📈 Charts & Graphs</div>
            <div className="text-sm space-y-1">
              <div>• Pie Chart (category breakdown)</div>
              <div>• Line Chart (daily spending trend)</div>
              <div>• Bar Chart (income vs expense)</div>
              <div>• Calendar View (heatmap)</div>
              <div>• Progress Bars (goals & budgets)</div>
            </div>
          </FlowBox>

          <FlowBox color="#ec4899">
            <div className="font-semibold mb-2">🎨 Customization Options</div>
            <div className="text-sm space-y-1">
              <div>• Light/Dark theme toggle</div>
              <div>• Custom category creation</div>
              <div>• Category icons & colors</div>
              <div>• Currency selection</div>
              <div>• Date range filters</div>
            </div>
          </FlowBox>
        </div>
      </FlowchartSection>

      {/* Notifications Flow */}
      <FlowchartSection title="5. Notifications & Reminders" icon={Bell} color="#06b6d4">
        <FlowBox color="#06b6d4">
          <div className="font-semibold mb-2">🔔 Notification System</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
            <div>• Daily expense reminder</div>
            <div>• Weekly summary ready</div>
            <div>• Budget limit warning (80%)</div>
            <div>• Goal milestone reached</div>
            <div>• New AI insight available</div>
            <div>• Challenge expiring soon</div>
            <div>• Achievement unlocked</div>
            <div>• Streak at risk warning</div>
          </div>
        </FlowBox>
      </FlowchartSection>

      {/* Privacy & Security */}
      <FlowchartSection title="6. Privacy & Security Layer" icon={Lock} color="#ef4444">
        <FlowBox color="#ef4444">
          <div className="font-semibold mb-2">🔒 Privacy-First Architecture</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="text-sm space-y-1">
              <div>✅ No bank account linking</div>
              <div>✅ Manual data entry only</div>
              <div>✅ Encrypted data storage</div>
              <div>✅ JWT authentication</div>
              <div>✅ HTTPS/TLS encryption</div>
            </div>
            <div className="text-sm space-y-1">
              <div>✅ Data export (CSV/JSON)</div>
              <div>✅ Account deletion option</div>
              <div>✅ Optional cloud sync</div>
              <div>✅ Transparent privacy policy</div>
              <div>✅ User data control</div>
            </div>
          </div>
        </FlowBox>
      </FlowchartSection>

      {/* Optional Social Layer */}
      <FlowchartSection title="7. Social/Community Layer (Optional)" icon={Users} color="#14b8a6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FlowBox color="#14b8a6">
            <div className="font-semibold mb-2">👥 Community Features</div>
            <div className="text-sm space-y-1">
              <div>• Share achievements (opt-in)</div>
              <div>• Public/private profiles</div>
              <div>• Finance tips feed</div>
              <div>• Success stories</div>
              <div>• Anonymous leaderboards</div>
            </div>
          </FlowBox>

          <FlowBox color="#14b8a6">
            <div className="font-semibold mb-2">🌐 Discover Tab</div>
            <div className="text-sm space-y-1">
              <div>• Curated AI finance tips</div>
              <div>• Motivational content</div>
              <div>• Budget challenges</div>
              <div>• Community highlights</div>
              <div>• Educational resources</div>
            </div>
          </FlowBox>
        </div>
      </FlowchartSection>

      {/* System Architecture Overview */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">🏗️ Complete System Architecture</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Frontend:</div>
            <div>React/Next.js + Tailwind CSS (Web/Mobile PWA)</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Backend:</div>
            <div>FastAPI + Python (REST API)</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">AI Engine:</div>
            <div>LangChain + OpenAI GPT / Local LLM</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Database:</div>
            <div>MongoDB (Document Store)</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Auth:</div>
            <div>JWT Token + bcrypt password hashing</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Deployment:</div>
            <div>Vercel (Frontend) + Railway/Render (Backend) + MongoDB Atlas</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Notifications:</div>
            <div>Web Push API / Service Workers (PWA)</div>
          </div>
        </div>
      </div>

      {/* Data Flow Summary */}
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-300">
        <h3 className="text-xl font-bold mb-3 text-gray-800">📊 Complete Data Flow</h3>
        <div className="text-sm space-y-2">
          <div className="font-semibold">1. User adds transaction → Saved to MongoDB Transactions</div>
          <div className="font-semibold">2. AI analyzes spending → Generates insights → Stored in AI_Insights</div>
          <div className="font-semibold">3. System checks challenges → Awards XP → Updates Achievements</div>
          <div className="font-semibold">4. Dashboard queries aggregated data → Generates charts</div>
          <div className="font-semibold">5. User chats with AI Coach → LangChain queries data → Returns personalized response</div>
          <div className="font-semibold">6. Scheduled jobs → Generate weekly reports → Send notifications</div>
        </div>
      </div>
    </div>
  );
}