import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="bg-background border-b border-border p-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">TRAC System</h1>
        <p className="text-sm text-muted-foreground">Welcome Gerwin Cando!</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Gerwin</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
          Gerwin
        </Button>
      </div>
    </div>
  );
};

export default Header;