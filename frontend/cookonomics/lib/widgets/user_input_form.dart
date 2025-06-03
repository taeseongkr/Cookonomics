import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import '../providers/user_data_provider.dart';

class UserInputForm extends StatefulWidget {
  const UserInputForm({super.key});

  @override
  State<UserInputForm> createState() => _UserInputFormState();
}

class _UserInputFormState extends State<UserInputForm> {
  final _formKey = GlobalKey<FormState>();
  final _ageController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _budgetController = TextEditingController();
  final _preferencesController = TextEditingController();

  final List<String> _genderOptions = ['Male', 'Female', 'Other'];
  final List<String> _activityLevels = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extremely Active'
  ];
  final List<String> _healthGoals = [
    'Lose Weight',
    'Maintain Weight',
    'Gain Weight',
    'Build Muscle',
    'Improve Health'
  ];
  final List<String> _dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'Low Fat',
    'Gluten Free',
    'Dairy Free'
  ];

  @override
  void initState() {
    super.initState();
    final userData = context.read<UserDataProvider>();
    
    // Initialize controllers with existing data
    if (userData.age != null) _ageController.text = userData.age.toString();
    if (userData.height != null) _heightController.text = userData.height.toString();
    if (userData.weight != null) _weightController.text = userData.weight.toString();
    if (userData.budget != null) _budgetController.text = userData.budget.toString();
    if (userData.preferences != null) _preferencesController.text = userData.preferences!;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserDataProvider>(
      builder: (context, userData, child) {
        return Form(
          key: _formKey,
          child: Column(
            children: [
              // Basic Information Card
              _buildSectionCard(
                'Basic Information',
                FontAwesomeIcons.user,
                [
                  Row(
                    children: [
                      Expanded(
                        child: _buildNumberField(
                          controller: _ageController,
                          label: 'Age',
                          icon: FontAwesomeIcons.calendar,
                          onChanged: (value) {
                            userData.setAge(int.tryParse(value));
                          },
                          validator: (value) {
                            if (value?.isEmpty ?? true) return 'Required';
                            final age = int.tryParse(value!);
                            if (age == null || age < 1 || age > 120) {
                              return 'Invalid age';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildDropdownField(
                          value: userData.gender,
                          items: _genderOptions,
                          label: 'Gender',
                          icon: FontAwesomeIcons.venusMars,
                          onChanged: userData.setGender,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildNumberField(
                          controller: _heightController,
                          label: 'Height (cm)',
                          icon: FontAwesomeIcons.rulerVertical,
                          onChanged: (value) {
                            userData.setHeight(double.tryParse(value));
                          },
                          validator: (value) {
                            if (value?.isEmpty ?? true) return 'Required';
                            final height = double.tryParse(value!);
                            if (height == null || height < 50 || height > 250) {
                              return 'Invalid height';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildNumberField(
                          controller: _weightController,
                          label: 'Weight (kg)',
                          icon: FontAwesomeIcons.weight,
                          onChanged: (value) {
                            userData.setWeight(double.tryParse(value));
                          },
                          validator: (value) {
                            if (value?.isEmpty ?? true) return 'Required';
                            final weight = double.tryParse(value!);
                            if (weight == null || weight < 20 || weight > 300) {
                              return 'Invalid weight';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ).animate().slideX(
                begin: -0.3,
                duration: 600.ms,
                delay: 100.ms,
              ),
              
              const SizedBox(height: 20),
              
              // Activity & Goals Card
              _buildSectionCard(
                'Activity & Goals',
                FontAwesomeIcons.dumbbell,
                [
                  _buildDropdownField(
                    value: userData.activityLevel,
                    items: _activityLevels,
                    label: 'Activity Level',
                    icon: FontAwesomeIcons.running,
                    onChanged: userData.setActivityLevel,
                  ),
                  const SizedBox(height: 16),
                  _buildDropdownField(
                    value: userData.healthGoal,
                    items: _healthGoals,
                    label: 'Health Goal',
                    icon: FontAwesomeIcons.bullseye,
                    onChanged: userData.setHealthGoal,
                  ),
                ],
              ).animate().slideX(
                begin: 0.3,
                duration: 600.ms,
                delay: 200.ms,
              ),
              
              const SizedBox(height: 20),
              
              // Budget & Preferences Card
              _buildSectionCard(
                'Budget & Preferences',
                FontAwesomeIcons.dollarSign,
                [
                  _buildNumberField(
                    controller: _budgetController,
                    label: 'Weekly Budget (\$)',
                    icon: FontAwesomeIcons.wallet,
                    onChanged: (value) {
                      userData.setBudget(double.tryParse(value));
                    },
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Required';
                      final budget = double.tryParse(value!);
                      if (budget == null || budget <= 0) {
                        return 'Invalid budget';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  _buildMultiSelectField(
                    'Dietary Preferences',
                    FontAwesomeIcons.leaf,
                    _dietaryOptions,
                    userData.dietaryRestrictions,
                    userData.setDietaryRestrictions,
                  ),
                  const SizedBox(height: 16),
                  _buildTextField(
                    controller: _preferencesController,
                    label: 'Additional Preferences',
                    icon: FontAwesomeIcons.heart,
                    hint: 'Any specific food preferences, allergies, or notes...',
                    maxLines: 3,
                    onChanged: userData.setPreferences,
                  ),
                ],
              ).animate().slideX(
                begin: -0.3,
                duration: 600.ms,
                delay: 300.ms,
              ),
              
              const SizedBox(height: 30),
              
              // BMI Display (if available)
              if (userData.bmi != null)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Your BMI',
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '${userData.bmi!.toStringAsFixed(1)} - ${userData.bmiCategory}',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                      Icon(
                        FontAwesomeIcons.chartLine,
                        color: Theme.of(context).colorScheme.primary,
                        size: 32,
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 400.ms),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionCard(String title, IconData icon, List<Widget> children) {
    return Container(
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
          Row(
            children: [
              Icon(
                icon,
                color: Theme.of(context).colorScheme.primary,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...children,
        ],
      ),
    );
  }

  Widget _buildNumberField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required Function(String) onChanged,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.number,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
      ),
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? hint,
    int maxLines = 1,
    Function(String)? onChanged,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon),
      ),
      onChanged: onChanged,
    );
  }

  Widget _buildDropdownField({
    String? value,
    required List<String> items,
    required String label,
    required IconData icon,
    required Function(String?) onChanged,
  }) {
    return DropdownButtonFormField2<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
      ),
      items: items.map((item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onChanged,
      validator: (value) => value == null ? 'Please select an option' : null,
      dropdownStyleData: DropdownStyleData(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  Widget _buildMultiSelectField(
    String label,
    IconData icon,
    List<String> options,
    List<String> selectedValues,
    Function(List<String>) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: options.map((option) {
            final isSelected = selectedValues.contains(option);
            return FilterChip(
              selected: isSelected,
              label: Text(option),
              onSelected: (selected) {
                final newList = List<String>.from(selectedValues);
                if (selected) {
                  newList.add(option);
                } else {
                  newList.remove(option);
                }
                onChanged(newList);
              },
              selectedColor: Theme.of(context).colorScheme.primary.withOpacity(0.3),
              checkmarkColor: Theme.of(context).colorScheme.primary,
            );
          }).toList(),
        ),
      ],
    );
  }
}
