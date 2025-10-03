'use client'
import { PricingTable } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { useTheme } from "next-themes"

// Custom feature display component
function PlanFeatures({ planName }: { planName: string }) {
    const features = {
        starter: [
            { text: "~125 Image Generations", icon: "��️" },
            { text: "~100 seconds Video Generation", icon: "🎥" },
            { text: "Access to All Models", icon: "🤖" },
            { text: "Commercial Use", icon: "💼" }
        ],
        basic: [
            { text: "~375 Image Generations", icon: "��️" },
            { text: "~300 seconds Video Generation", icon: "🎥" },
            { text: "Access to All Models", icon: "🤖" },
            { text: "Commercial Use", icon: "💼" }
        ],
        pro: [
            { text: "~875 Image Generations", icon: "��️" },
            { text: "~700 seconds Video Generation", icon: "🎥" },
            { text: "Access to All Models", icon: "🤖" },
            { text: "Commercial Use", icon: "💼" }
        ],
        custom: [
            { text: "Flexible Amount", icon: "⚡" },
            { text: "Access to All Models", icon: "🤖" },
            { text: "Commercial Use", icon: "💼" }
        ]
    };

    const planFeatures = features[planName as keyof typeof features] || [];

    return (
        <div className="mt-4 space-y-2">
            {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">{feature.icon}</span>
                    <span>{feature.text}</span>
                </div>
            ))}
        </div>
    );
}

export default function EnhancedClerkPricing() {
    const { theme } = useTheme()
    
    return (
        <div className="space-y-8">
            {/* Custom header with credit amounts */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Get credits for AI image and video generation
                </p>
            </div>

            {/* Clerk PricingTable with custom styling */}
            <PricingTable
                appearance={{
                    baseTheme: theme === "dark" ? dark : undefined,
                    elements: {
                        pricingTableCardTitle: {
                            fontSize: 20,
                            fontWeight: 400,
                        },
                        pricingTableCardDescription: {
                            fontSize: 14
                        },
                        pricingTableCardFee: {
                            fontSize: 36,
                            fontWeight: 800,  
                        },
                        pricingTable: {
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        },
                        // Hide default features since we're using custom ones
                        pricingTableCardFeatures: {
                            display: 'none',
                        },
                    },
                }}
            />

            {/* Custom feature display below each plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                    <h3 className="font-semibold mb-2">STARTER</h3>
                    <div className="text-sm text-gray-500 mb-2">500 credits</div>
                    <PlanFeatures planName="starter" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold mb-2">BASIC</h3>
                    <div className="text-sm text-gray-500 mb-2">1500 credits</div>
                    <PlanFeatures planName="basic" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold mb-2">PRO</h3>
                    <div className="text-sm text-gray-500 mb-2">3500 credits</div>
                    <PlanFeatures planName="pro" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold mb-2">CUSTOM</h3>
                    <div className="text-sm text-gray-500 mb-2">1500 credits</div>
                    <PlanFeatures planName="custom" />
                </div>
            </div>
        </div>
    );
}

