import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    console.log(items);

    // Validate that items array is provided
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a non-empty array of fridge items",
        },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured",
        },
        { status: 500 }
      );
    }

    // Create the prompt for OpenAI
    const prompt = `I have the following ingredients in my fridge: ${items.join(", ")}.

Please suggest 3-5 creative and practical recipes I can make using some or all of these ingredients. For each recipe, provide:
1. Recipe name
2. Brief description
3. Main ingredients needed (from my fridge items)
4. Estimated cooking time
5. Difficulty level (Easy/Medium/Hard)

Format your response as a JSON array of recipe objects. Each object should have properties: recipe_name, brief_description, main_ingredients, estimated_cooking_time, difficulty_level. `;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful cooking assistant. Always respond with valid JSON format when requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recipeText = data.choices[0]?.message?.content;

    if (!recipeText) {
      throw new Error("No response from OpenAI");
    }

    // Try to parse the JSON response from OpenAI
    let recipes;
    try {
      recipes = JSON.parse(recipeText);
      console.log("Successfully parsed JSON response");
    } catch (parseError) {
      console.log(
        "Failed to parse JSON directly, checking for markdown-wrapped JSON",
        parseError
      );

      // Try to extract JSON from markdown code blocks
      const jsonMatch = recipeText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          recipes = JSON.parse(jsonMatch[1]);
          console.log("Successfully extracted and parsed JSON from markdown");
        } catch (markdownParseError) {
          console.error(
            "Failed to parse extracted JSON, using fallback format: ",
            markdownParseError
          );
          recipes = [
            {
              recipe_name: "Recipe Suggestions",
              brief_description: recipeText,
              main_ingredients: items,
              estimated_cooking_time: "Varies",
              difficulty_level: "Varies",
            },
          ];
        }
      } else {
        console.log("No JSON found in markdown, using fallback format");
        recipes = [
          {
            recipe_name: "Recipe Suggestions",
            brief_description: recipeText,
            main_ingredients: items,
            estimated_cooking_time: "Varies",
            difficulty_level: "Varies",
          },
        ];
      }
    }

    return NextResponse.json({
      success: true,
      recipes: recipes,
      fridgeItems: items,
    });
  } catch (error) {
    console.error("Error generating recipes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recipe suggestions. Please try again.",
      },
      { status: 500 }
    );
  }
}
