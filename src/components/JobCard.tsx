import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface JobCardProps {
  id: string;
  title: string;
  organization: string;
  location: string;
  qualification: string;
  applicationDeadline: string;
  category: string;
  vacancies: number;
  isNew?: boolean;
}

const JobCard = ({ 
  id, 
  title, 
  organization, 
  location, 
  qualification, 
  applicationDeadline, 
  category, 
  vacancies,
  isNew = false 
}: JobCardProps) => {
  const deadlineDate = new Date(applicationDeadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isNew && <Badge className="bg-accent hover:bg-accent-hover">New</Badge>}
              <Badge variant="secondary" className="text-xs">{category}</Badge>
            </div>
            <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">
              {title}
            </h3>
            <p className="text-muted-foreground font-medium">{organization}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 mr-2 text-primary" />
            <span>{qualification}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Vacancies:</span>
              <span className="font-semibold text-primary ml-1">{vacancies}</span>
            </div>
            
            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
              daysLeft <= 3 
                ? "bg-destructive/10 text-destructive" 
                : daysLeft <= 7 
                  ? "bg-yellow-500/10 text-yellow-700"
                  : "bg-accent/10 text-accent"
            }`}>
              <Clock className="h-3 w-3 mr-1" />
              <span>{daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Link to={`/jobs/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button className="flex-1 bg-gradient-primary hover:bg-primary-hover">
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;