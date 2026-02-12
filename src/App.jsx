import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [answer, setAnswer] = useState(null)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [noButtonSize, setNoButtonSize] = useState(1)
  const [yesButtonSize, setYesButtonSize] = useState(1)
  const [noClickCount, setNoClickCount] = useState(0)
  const [hearts, setHearts] = useState([])
  const [isPositioned, setIsPositioned] = useState(false)
  const noButtonRef = useRef(null)
  const containerRef = useRef(null)
  const buttonsContainerRef = useRef(null)

  const messages = [
    "Will you be my Valentine? 💕",
    "Pretty please? 🥺",
    "Are you sure about that? 💔",
    "Come on, just say yes! 🌹",
    "I'll buy you chocolate! 🍫",
    "Think about all the fun we'll have! 🎉",
    "You're making this harder than it needs to be! 😅",
    "The button is running away... 🏃",
    "Still chasing that No button? 🙈",
    "You know you want to say yes! 😊",
    "I'll throw in pizza too! 🍕",
    "This is getting ridiculous... 😂",
    "Fine, I'll add ice cream to the deal! 🍦",
    "The Yes button is getting lonely... 💝",
    "Are your fingers tired yet? 😏",
    "I promise I don't bite! 😇",
    "Even the button is saying 'just give up'! 🤷",
    "Plot twist: There is no No button! 🎭",
    "Roses are red, violets are blue, just click Yes, you know you want to! 🌹",
    "I can do this all day! ⏰",
    "The button has trust issues now... 🏃‍♂️",
    "Okay, you're impressively persistent! 💪",
    "Is this a workout routine? 🏋️",
    "The button filed a restraining order! 📜",
    "I admire your dedication to clicking No! 😆"
  ]

  const getCurrentMessage = () => {
    if (noClickCount >= messages.length) {
      return messages[messages.length - 1]
    }
    return messages[noClickCount]
  }

  const moveNoButton = () => {
    if (answer !== null || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const card = document.querySelector('.question-card')?.getBoundingClientRect() || { top: 0, left: 0, width: 0, height: 0 }

    // Adjusted button dimensions with scale taken into account
    const scale = Math.max(noButtonSize - 0.06, 0.5)
    const buttonWidth = 140 * scale
    const buttonHeight = 60 * scale

    const maxX = container.width - buttonWidth - 40
    const maxY = container.height - buttonHeight - 40

    let randomX, randomY
    let attempts = 0
    let isOverlapping = true

    // Try to find a position that doesn't overlap with the question card
    while (isOverlapping && attempts < 20) {
      randomX = Math.random() * maxX + 20
      randomY = Math.random() * maxY + 20

      // Check for overlap with the question card area (with a buffer)
      const buffer = 50
      const overlapX = randomX + buttonWidth > card.left - buffer && randomX < card.right + buffer
      const overlapY = randomY + buttonHeight > card.top - buffer && randomY < card.bottom + buffer

      if (!(overlapX && overlapY)) {
        isOverlapping = false
      }
      attempts++
    }

    setNoButtonPosition({ x: randomX, y: randomY })
    setIsPositioned(true)

    // Very gradual size changes - minimum 5 attempts before getting too small
    setNoButtonSize(scale)
    setYesButtonSize(prev => Math.min(prev + 0.12, 2.5))
    setNoClickCount(prev => prev + 1)
  }

  const handleNoHover = () => {
    moveNoButton()
  }

  const handleNoClick = (e) => {
    e.preventDefault()
    moveNoButton()
  }

  const handleYesClick = () => {
    setAnswer('yes')
    createHearts()
  }

  const createHearts = () => {
    const newHearts = []
    for (let i = 0; i < 50; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 20 + Math.random() * 30
      })
    }
    setHearts(newHearts)
  }

  if (answer === 'yes') {
    return (
      <div className="success-container">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`
            }}
          >
            ❤️
          </div>
        ))}
        <div className="success-content">
          <h1 className="success-title">Yay! 🎉</h1>
          <p className="success-message">
            I knew you'd say yes! Get ready for the best Valentine's Day ever! 💕
          </p>
          <div className="celebration-emoji">🥰💐🍫🎁✨</div>
          <button
            className="restart-button"
            onClick={() => {
              setAnswer(null)
              setNoClickCount(0)
              setNoButtonSize(1)
              setYesButtonSize(1)
              setNoButtonPosition({ x: 0, y: 0 })
              setIsPositioned(false)
              setHearts([])
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" ref={containerRef}>
      <div className="question-card">
        <h1 className="title">{getCurrentMessage()}</h1>

        <div className="buttons-container" ref={buttonsContainerRef}>
          <button
            className="yes-button"
            onClick={handleYesClick}
            style={{
              transform: `scale(${yesButtonSize})`,
            }}
          >
            Yes! 💖
          </button>

          {/* Show placeholder when button is positioned elsewhere */}
          {!isPositioned && (
            <button
              ref={noButtonRef}
              className="no-button"
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoClick}
            >
              No
            </button>
          )}
        </div>

        {noClickCount >= 5 && (
          <p className="hint">
            (Hint: The "No" button is shy and runs away! 😄)
          </p>
        )}
      </div>

      {/* No button positioned absolutely across the entire screen */}
      {isPositioned && (
        <button
          ref={noButtonRef}
          className="no-button floating-no-button"
          onClick={handleNoClick}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoClick}
          style={{
            transform: `scale(${noButtonSize})`,
            left: `${noButtonPosition.x}px`,
            top: `${noButtonPosition.y}px`,
          }}
        >
          {noClickCount >= 8 ? '🙈' : 'No'}
        </button>
      )}

      <div className="floating-hearts">
        <span className="floating-heart" style={{ animationDelay: '0s' }}>💕</span>
        <span className="floating-heart" style={{ animationDelay: '1s' }}>💝</span>
        <span className="floating-heart" style={{ animationDelay: '2s' }}>💖</span>
        <span className="floating-heart" style={{ animationDelay: '1.5s' }}>💗</span>
        <span className="floating-heart" style={{ animationDelay: '0.5s' }}>💓</span>
      </div>
    </div>
  )
}

export default App
