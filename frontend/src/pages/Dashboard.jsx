import { useState, useMemo, useCallback } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, Filter, Home as HomeIcon, Calendar as CalendarIcon, Flame } from "lucide-react"
import TaskModal from "../components/AddTask"
import TaskItem from "../components/TaskItem"
import axios from "axios"

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material'

// API Base
const API_BASE = "http://localhost:3000/api/tasks"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(false)

  // Calculate stats
  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === "low").length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === "medium").length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === "high").length,
    completed: tasks.filter(t =>
      t.completed === true || t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length,
  }), [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)
    switch (filter) {
      case "today":
        return dueDate.toDateString() === today.toDateString()
      case "week":
        return dueDate >= today && dueDate <= nextWeek
      case "high":
      case "medium":
      case "low":
        return task.priority?.toLowerCase() === filter
      default:
        return true
    }
  }), [tasks, filter])

  const handleTaskSave = useCallback(async (taskData, isEdit) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const url = isEdit ? `${API_BASE}/${taskData.id}` : API_BASE
      const method = isEdit ? 'put' : 'post'
      
      await axios({
        method,
        url,
        data: taskData,
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setShowModal(false)
      setSelectedTask(null)
      refreshTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }, [refreshTasks])

  const statItems = [
    { key: 'total', label: 'Total Tasks', value: stats.total, icon: Flame, color: '#1976D2' },
    { key: 'completed', label: 'Completed', value: stats.completed, icon: Flame, color: '#2E7D32' },
    { key: 'highPriority', label: 'High Priority', value: stats.highPriority, icon: Flame, color: '#D32F2F' },
    { key: 'mediumPriority', label: 'Medium Priority', value: stats.mediumPriority, icon: Flame, color: '#ED6C02' },
    { key: 'lowPriority', label: 'Low Priority', value: stats.lowPriority, icon: Flame, color: '#0288D1' },
  ]

  const filterOptions = ["all", "today", "week", "high", "medium", "low"]
  const filterLabels = {
    all: "All Tasks",
    today: "Today",
    week: "This Week",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority"
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700, 
            color: '#212121',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <HomeIcon style={{ color: '#1976D2' }} />
            Task Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your tasks efficiently
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setShowModal(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            alignSelf: { xs: 'stretch', sm: 'center' },
            px: 3,
            py: 1.5
          }}
        >
          Add New Task
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statItems.map(({ key, label, value, icon: Icon, color }) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 2, 
                  bgcolor: `${color}10`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Icon style={{ color, width: 20, height: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {label}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Filter style={{ color: '#1976D2' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#212121' }}>
            {filterLabels[filter]}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant={filter === option ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter(option)}
              sx={{
                textTransform: 'none',
                borderRadius: 4,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                borderColor: '#1976D2',
                color: filter === option ? '#fff' : '#1976D2',
                backgroundColor: filter === option ? '#1976D2' : 'transparent',
                '&:hover': {
                  backgroundColor: filter === option ? '#1565C0' : 'rgba(25, 118, 210, 0.04)',
                  borderColor: '#1565C0'
                }
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Task List */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          minHeight: 400
        }}
      >
        {filteredTasks.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}>
            <CalendarIcon style={{ width: 48, height: 48, color: '#90A4AE', marginBottom: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: '#212121' }}>
              No tasks found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 300 }}>
              {filter === "all" 
                ? "Create your first task to get started" 
                : "No tasks match this filter"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => setShowModal(true)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' }
              }}
            >
              Add New Task
            </Button>
          </Box>
        ) : (
          <Box sx={{ '& > *:not(:last-child)': { mb: 1 } }}>
            {filteredTasks.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task)
                  setShowModal(true)
                }}
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false)
          setSelectedTask(null)
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </Box>
  )
}

export default Dashboard
