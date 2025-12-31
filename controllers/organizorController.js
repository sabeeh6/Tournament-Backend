import { success } from "zod";
import { Ground } from "../model/grounds.js";
import { openAi } from "../config/openAi.js";

export const createTournamentSchedule = async (req, res) => {
  try {
    const { teams, totalDays } = req.body;

    if (!teams || teams.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 teams required"
      });
    }

    const prompt = `
Create a fair round-robin tournament schedule.

Rules:
- Teams: ${teams.join(", ")}
- Total days: ${totalDays}
- Matches per day: 1
- A team must not play more than once per day
- Return STRICT JSON only
- make sure that all teams play equal matches.
- No explanation, no markdown, no extra text
-also remove the exta sentences , just give response only
-give me proper data in good way 
Output format:
[
  {
    "match": "Team A vs Team B",
    "day": "1",
  }
]
`;

    const response = await openAi.chat.completions.create({
      model: "openai/gpt-5.2",
      messages: [
        { role: "system", content: "You are a tournament scheduling engine." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 600
    });

    const raw = response.choices[0].message.content;
    //  const raw = JSON.parse(response.choices[0].message.content)

console.log("raw" , raw);
 const extractJsonArray = (text) => {
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error("No JSON array found in AI response");
  }

  const jsonString = text.slice(firstBracket, lastBracket + 1);
  return JSON.parse(jsonString);
};
    // let schedule;
    // try {
    //   schedule = JSON.parse(raw);
    // } catch {
    //   return res.status(500).json({
    //     success: false,
    //     message: "AI returned invalid JSON",
    //     raw
    //   });
    // }
    const schedule = extractJsonArray(raw);

    return res.status(200).json({
      success: true,
      data: schedule
    });

  } catch (error) {
    console.error("OpenRouter Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.error?.message || "AI scheduling failed"
    });
  }
};
export const createGround = async(req , res)=>{
    try {
        const {groundName , status , type , price , description , location  } = req.body
        
        const userId = req.user._id
        if (!userId) {
            return res.status(404).json({success:false , message:"User Id not found"})
        }
        const ground = new Ground({
            groundName,
            groundOwner:userId,
            status,
            type,
            price,
            description,
            location
        })
        await ground.save()

        return res.status(201).json({
            success:true,
            Data:ground
        })
        
    } catch (error) {
        console.log("Error" , error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const updateGround = async (req, res) => {
  try {
    const { id } = req.params;

    const ground = await Ground.findById(id);

    if (!ground) {
      return res.status(404).json({
        success: false,
        message: "Ground not found"
      });
    }

    // ✅ Update only provided fields
    const { groundName, status, type, price, description } = req.body;

    if (groundName !== undefined) ground.groundName = groundName;
    if (status !== undefined) ground.status = status;
    if (type !== undefined) ground.type = type;
    if (price !== undefined) ground.price = price;
    if (description !== undefined) ground.description = description;

    await ground.save();

    return res.status(200).json({
      success: true,
      message: "Ground updated successfully",
      data: ground
    });

  } catch (error) {
    console.error("Update Ground Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getGroundsById = async(req,res) => {
    try {
        const userId = req.user._id       
        const grounds = await Ground.find({groundOwner:userId})
        console.log("Ground" , grounds.length , grounds) ;
        if (!grounds) {
            return res.status(404).json({success:false , message:"Grounds not found"})
        }

        res.status(200).json({
            success:true,
            message:{
                Length:grounds.length,
                data:grounds
            }
        })
        
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}

export const delGround = async(req,res) => {
    try {
        const {id} = req.params
        const del = await Ground.findByIdAndDelete(id)
        if (!del) {
            return res.status(404).json({success:false , message:"Ground not found"})
        }

        res.status(200).json({
            success:true,
            message:"Ground deleted successfully 🙌"
        })
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}


