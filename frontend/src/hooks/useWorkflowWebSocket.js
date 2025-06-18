import { useState, useEffect, useRef } from 'react';
import { createWorkflowWebSocketConnection } from '../utils/api';
import { parseMealPlan } from '../utils/mealPlanParser';

export const useWorkflowWebSocket = (sessionId) => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState('connecting');
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    const connect = () => {
      try {
        console.log('Connecting to WebSocket with session ID:', sessionId);
        const ws = createWorkflowWebSocketConnection(sessionId);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected successfully');
          setIsConnected(true);
          setIsLoading(false);
          setError(null);
          setWorkflowStatus('connected');
          reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);
            
            switch (data.type) {
              case 'workflow_update':
                setWorkflowStatus(data.status || 'processing');
                
                // Check if this is the workflow completion with meal plans
                if (data.step === 'workflow_complete' && data.status === 'completed') {
                  if (data.data && data.data.meal_plans) {
                    try {
                      const parsedMealPlan = parseMealPlan(data.data);
                      setMealPlan(parsedMealPlan);
                      console.log('Parsed meal plan from workflow completion:', parsedMealPlan);
                    } catch (parseError) {
                      console.error('Error parsing meal plan from workflow completion:', parseError);
                      // Fallback: store raw meal plan data
                      setMealPlan(data.data);
                    }
                  }
                  setIsLoading(false);
                }
                break;
              case 'workflow_progress':
                setWorkflowStatus(data.status || 'processing');
                break;
              case 'recipes_generated':
                setRecipes(data.recipes || []);
                setWorkflowStatus('completed');
                setIsLoading(false);
                break;
              case 'meal_plan_generated':
                // Handle meal plan data - could be markdown or structured
                if (data.meal_plan) {
                  try {
                    const parsedMealPlan = parseMealPlan(data.meal_plan);
                    setMealPlan(parsedMealPlan);
                    console.log('Parsed meal plan:', parsedMealPlan);
                  } catch (parseError) {
                    console.error('Error parsing meal plan:', parseError);
                    // Fallback: store raw meal plan data
                    setMealPlan({ raw: data.meal_plan });
                  }
                }
                setWorkflowStatus('completed');
                setIsLoading(false);
                break;
              case 'workflow_error':
                setError(data.error || 'Workflow failed');
                setWorkflowStatus('failed');
                setIsLoading(false);
                break;
              case 'workflow_completed':
                setWorkflowStatus('completed');
                setIsLoading(false);
                break;
              case 'connection_established':
                console.log('WebSocket connection established:', data.message);
                break;
              default:
                console.log('Unknown message type:', data.type);
                // Check if the message contains meal plan data in plain text
                if (typeof event.data === 'string' && event.data.includes('## Meal Plan')) {
                  try {
                    const parsedMealPlan = parseMealPlan(event.data);
                    setMealPlan(parsedMealPlan);
                    console.log('Parsed meal plan from raw message:', parsedMealPlan);
                    setWorkflowStatus('completed');
                    setIsLoading(false);
                  } catch (parseError) {
                    console.error('Error parsing raw meal plan message:', parseError);
                  }
                }
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
            // Try to parse as raw meal plan text
            if (typeof event.data === 'string' && event.data.includes('## Meal Plan')) {
              try {
                const parsedMealPlan = parseMealPlan(event.data);
                setMealPlan(parsedMealPlan);
                console.log('Parsed meal plan from non-JSON message:', parsedMealPlan);
                setWorkflowStatus('completed');
                setIsLoading(false);
              } catch (parseError) {
                console.error('Error parsing raw meal plan message:', parseError);
              }
            }
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error occurred');
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          setIsConnected(false);
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 2000 * reconnectAttempts.current); // Exponential backoff
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            setError('Failed to reconnect to server');
            setWorkflowStatus('failed');
          }
        };

      } catch (err) {
        console.error('Error creating WebSocket connection:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [sessionId]);

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
    }
  };

  return {
    recipes,
    mealPlan,
    isConnected,
    isLoading,
    error,
    workflowStatus,
    disconnect
  };
};
