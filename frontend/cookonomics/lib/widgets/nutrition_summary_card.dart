import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../providers/user_data_provider.dart';

class NutritionSummaryCard extends StatelessWidget {
  const NutritionSummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<UserDataProvider>(
      builder: (context, userData, child) {
        if (!userData.isDataComplete) {
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(
                  FontAwesomeIcons.triangleExclamation,
                  color: Colors.orange,
                  size: 48,
                ),
                const SizedBox(height: 16),
                Text(
                  'Complete Your Profile',
                  style: Theme.of(context).textTheme.headlineSmall,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Please fill in all required fields to see your nutrition summary',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return Column(
          children: [
            // Main summary card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          FontAwesomeIcons.chartPie,
                          color: Theme.of(context).colorScheme.primary,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Your Nutrition Profile',
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            Text(
                              'Personalized for ${userData.gender}, ${userData.age} years old',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Key metrics grid
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.2,
                    children: [
                      _buildMetricCard(
                        context,
                        'BMI',
                        '${userData.bmi!.toStringAsFixed(1)}',
                        userData.bmiCategory,
                        FontAwesomeIcons.weight,
                        _getBMIColor(userData.bmi!),
                      ),
                      _buildMetricCard(
                        context,
                        'Daily Calories',
                        '${userData.dailyCalorieNeeds!.round()}',
                        'kcal needed',
                        FontAwesomeIcons.fire,
                        Colors.orange,
                      ),
                      _buildMetricCard(
                        context,
                        'Weekly Budget',
                        '\$${userData.budget!.toStringAsFixed(0)}',
                        'for healthy meals',
                        FontAwesomeIcons.dollarSign,
                        Colors.green,
                      ),
                      _buildMetricCard(
                        context,
                        'Activity Level',
                        userData.activityLevel!,
                        userData.healthGoal!,
                        FontAwesomeIcons.dumbbell,
                        Colors.purple,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Dietary preferences
                  if (userData.dietaryRestrictions.isNotEmpty) ...[
                    Row(
                      children: [
                        Icon(
                          FontAwesomeIcons.leaf,
                          color: Theme.of(context).colorScheme.primary,
                          size: 16,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Dietary Preferences',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: userData.dietaryRestrictions.map((pref) {
                        return Chip(
                          label: Text(pref),
                          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          labelStyle: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                  ],
                  
                  // Additional preferences
                  if (userData.preferences?.isNotEmpty == true) ...[
                    Row(
                      children: [
                        Icon(
                          FontAwesomeIcons.heart,
                          color: Theme.of(context).colorScheme.secondary,
                          size: 16,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Additional Notes',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        userData.preferences!,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ),
                  ],
                ],
              ),
            ).animate().slideY(
              begin: 0.3,
              duration: 600.ms,
              curve: Curves.easeOutBack,
            ),
            
            const SizedBox(height: 20),
            
            // Recommendations card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(
                        FontAwesomeIcons.lightbulb,
                        color: Theme.of(context).colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Personalized Recommendations',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _getPersonalizedRecommendation(userData),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ).animate().fadeIn(
              delay: 300.ms,
              duration: 600.ms,
            ),
          ],
        );
      },
    );
  }

  Widget _buildMetricCard(
    BuildContext context,
    String title,
    String value,
    String subtitle,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.2),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            title,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.bodySmall,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Color _getBMIColor(double bmi) {
    if (bmi < 18.5) return Colors.blue;
    if (bmi < 25) return Colors.green;
    if (bmi < 30) return Colors.orange;
    return Colors.red;
  }

  String _getPersonalizedRecommendation(UserDataProvider userData) {
    final bmi = userData.bmi!;
    final goal = userData.healthGoal!;
    final budget = userData.budget!;
    
    String recommendation = "Based on your profile, ";
    
    if (goal == 'Lose Weight' && bmi > 25) {
      recommendation += "focus on lean proteins, vegetables, and whole grains. ";
    } else if (goal == 'Gain Weight' && bmi < 18.5) {
      recommendation += "include healthy fats, protein-rich foods, and calorie-dense snacks. ";
    } else if (goal == 'Build Muscle') {
      recommendation += "prioritize protein intake (1.6-2.2g per kg body weight) and complex carbs. ";
    } else {
      recommendation += "maintain a balanced diet with varied nutrients. ";
    }
    
    if (budget < 50) {
      recommendation += "Consider cost-effective options like beans, lentils, eggs, and seasonal produce.";
    } else if (budget > 100) {
      recommendation += "You can explore premium ingredients like salmon, organic produce, and specialty health foods.";
    } else {
      recommendation += "You have a good budget for quality ingredients and meal variety.";
    }
    
    return recommendation;
  }
}
