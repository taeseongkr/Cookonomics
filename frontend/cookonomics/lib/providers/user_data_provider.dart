import 'package:flutter/foundation.dart';

class UserDataProvider extends ChangeNotifier {
  // User profile data
  int? _age;
  double? _height;
  double? _weight;
  String? _gender;
  double? _budget;
  String? _preferences;
  
  // Activity level and goals
  String? _activityLevel;
  String? _healthGoal;
  List<String> _dietaryRestrictions = [];
  List<String> _allergies = [];

  // Getters
  int? get age => _age;
  double? get height => _height;
  double? get weight => _weight;
  String? get gender => _gender;
  double? get budget => _budget;
  String? get preferences => _preferences;
  String? get activityLevel => _activityLevel;
  String? get healthGoal => _healthGoal;
  List<String> get dietaryRestrictions => _dietaryRestrictions;
  List<String> get allergies => _allergies;

  // Setters
  void setAge(int? value) {
    _age = value;
    notifyListeners();
  }

  void setHeight(double? value) {
    _height = value;
    notifyListeners();
  }

  void setWeight(double? value) {
    _weight = value;
    notifyListeners();
  }

  void setGender(String? value) {
    _gender = value;
    notifyListeners();
  }

  void setBudget(double? value) {
    _budget = value;
    notifyListeners();
  }

  void setPreferences(String? value) {
    _preferences = value;
    notifyListeners();
  }

  void setActivityLevel(String? value) {
    _activityLevel = value;
    notifyListeners();
  }

  void setHealthGoal(String? value) {
    _healthGoal = value;
    notifyListeners();
  }

  void setDietaryRestrictions(List<String> value) {
    _dietaryRestrictions = value;
    notifyListeners();
  }

  void setAllergies(List<String> value) {
    _allergies = value;
    notifyListeners();
  }

  // Computed properties
  double? get bmi {
    if (_height != null && _weight != null && _height! > 0) {
      return _weight! / ((_height! / 100) * (_height! / 100));
    }
    return null;
  }

  String get bmiCategory {
    final bmiValue = bmi;
    if (bmiValue == null) return 'Unknown';
    
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  }

  bool get isDataComplete {
    return _age != null &&
           _height != null &&
           _weight != null &&
           _gender != null &&
           _budget != null &&
           _activityLevel != null &&
           _healthGoal != null;
  }

  // Calculate daily calorie needs (simplified Harris-Benedict equation)
  double? get dailyCalorieNeeds {
    if (_age == null || _height == null || _weight == null || _gender == null || _activityLevel == null) {
      return null;
    }

    double bmr;
    if (_gender == 'Male') {
      bmr = 88.362 + (13.397 * _weight!) + (4.799 * _height!) - (5.677 * _age!);
    } else {
      bmr = 447.593 + (9.247 * _weight!) + (3.098 * _height!) - (4.330 * _age!);
    }

    double activityMultiplier;
    switch (_activityLevel) {
      case 'Sedentary':
        activityMultiplier = 1.2;
        break;
      case 'Lightly Active':
        activityMultiplier = 1.375;
        break;
      case 'Moderately Active':
        activityMultiplier = 1.55;
        break;
      case 'Very Active':
        activityMultiplier = 1.725;
        break;
      case 'Extremely Active':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.55;
    }

    return bmr * activityMultiplier;
  }

  void clearData() {
    _age = null;
    _height = null;
    _weight = null;
    _gender = null;
    _budget = null;
    _preferences = null;
    _activityLevel = null;
    _healthGoal = null;
    _dietaryRestrictions = [];
    _allergies = [];
    notifyListeners();
  }
}
