import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Devtone</h1>
          <p className="text-gray-300">Professional Project Management</p>
        </div>
        
        <Card className="glass-card rounded-2xl shadow-2xl border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">Welcome to Devtone</h2>
              
              <div className="space-y-4 mb-8">
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-300">Real-time project tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-300">Team communication & feedback</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-300">Client & admin dashboards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-300">Live updates & notifications</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-primary hover:bg-secondary py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Sign In to Continue
                </Button>
                
                <Button 
                  onClick={() => window.location.href = "/signup"}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-[hsl(249,57%,14%)] hover:text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Create New Account
                </Button>
              </div>
              
              <p className="text-gray-400 text-sm mt-4">
                Secure authentication powered by Replit
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
