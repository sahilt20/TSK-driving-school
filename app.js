// Cricket Field Planner Application
class CricketFieldPlanner {
    constructor() {
        this.players = [];
        this.currentFormation = 'custom';
        this.savedFields = [];
        this.isLeftHandedBatsman = false;
        this.currentZoom = 100;
        this.snapToGrid = false;
        this.draggedPlayer = null;
        this.isDragging = false;
        
        // Field position data
        this.positions = this.initializePositions();
        this.presetFormations = this.initializePresetFormations();
        
        this.init();
    }

    init() {
        this.setupElements();
        this.createPlayers();
        this.setupEventListeners();
        this.loadSavedFields();
        this.setDefaultFormation();
        this.updateFieldBalance();
    }

    setupElements() {
        // Main elements
        this.groundElement = document.getElementById('cricketGround');
        this.playersContainer = document.getElementById('playersContainer');
        this.tooltip = document.getElementById('positionTooltip');
        
        // Control elements
        this.presetSelect = document.getElementById('presetFormation');
        this.batsmanTypeSelect = document.getElementById('batsmanType');
        this.bowlerTypeSelect = document.getElementById('bowlerType');
        this.overStageSelect = document.getElementById('overStage');
        
        // Button elements
        this.fourSlipsBtn = document.getElementById('fourSlipsBtn');
        this.ringFieldBtn = document.getElementById('ringFieldBtn');
        this.boundaryRidersBtn = document.getElementById('boundaryRidersBtn');
        this.saveFieldBtn = document.getElementById('saveFieldBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.resetFieldBtn = document.getElementById('resetFieldBtn');
        
        // Analysis elements
        this.showCoverageBtn = document.getElementById('showCoverageBtn');
        this.showGapsBtn = document.getElementById('showGapsBtn');
        this.showRestrictionsBtn = document.getElementById('showRestrictionsBtn');
        
        // Modal elements
        this.saveModal = document.getElementById('saveFieldModal');
        this.playerEditModal = document.getElementById('playerEditModal');
        
        // Other elements
        this.playerList = document.getElementById('playerList');
        this.fieldBalanceDisplay = document.getElementById('fieldBalance');
        this.effectivenessRating = document.getElementById('effectivenessRating');
        this.effectivenessText = document.getElementById('effectivenessText');
        this.savedFieldsContainer = document.getElementById('savedFields');
    }

    initializePositions() {
        return {
            close_catching: [
                { name: "Wicket Keeper", position: [0, -15], description: "Behind the stumps, catches deliveries and prevents byes" },
                { name: "First Slip", position: [8, -18], description: "Catches edges off fast bowlers" },
                { name: "Second Slip", position: [15, -20], description: "Additional slip catching position" },
                { name: "Third Slip", position: [22, -22], description: "Extended slip cordon for attacking field" },
                { name: "Gully", position: [30, -15], description: "Catches deflections at 60° angle on off side" },
                { name: "Short Leg", position: [-25, 8], description: "Close on leg side for catching edges" },
                { name: "Silly Point", position: [25, 8], description: "Close on off side, especially for spin bowling" },
                { name: "Silly Mid-Off", position: [15, 15], description: "Very close to batsman on off side" },
                { name: "Silly Mid-On", position: [-15, 15], description: "Very close to batsman on leg side" },
                { name: "Leg Slip", position: [-8, -18], description: "Rare position behind wicketkeeper on leg side" }
            ],
            inner_ring: [
                { name: "Point", position: [50, 0], description: "Square on off side, key position for saving runs" },
                { name: "Cover", position: [45, 25], description: "Between point and mid-off, intercepts driving shots" },
                { name: "Extra Cover", position: [35, 35], description: "Between cover and mid-off positions" },
                { name: "Mid-Off", position: [20, 45], description: "Straight on off side, stops straight drives" },
                { name: "Mid-On", position: [-20, 45], description: "Straight on leg side, mirror of mid-off" },
                { name: "Mid-Wicket", position: [-45, 25], description: "Between square leg and mid-on" },
                { name: "Square Leg", position: [-50, 0], description: "Square on leg side, level with batsman" },
                { name: "Backward Square Leg", position: [-45, -15], description: "Behind square on leg side" },
                { name: "Backward Point", position: [45, -15], description: "Behind square on off side" },
                { name: "Short Third Man", position: [40, -30], description: "Shorter version of third man position" },
                { name: "Short Fine Leg", position: [-40, -30], description: "Shorter version of fine leg position" }
            ],
            outfield: [
                { name: "Third Man", position: [65, -60], description: "Deep on off side boundary, saves runs from edges" },
                { name: "Deep Point", position: [80, -20], description: "Deep backward point on boundary" },
                { name: "Deep Cover", position: [75, 35], description: "Deep cover on boundary line" },
                { name: "Long Off", position: [35, 75], description: "Straight boundary on off side" },
                { name: "Long On", position: [-35, 75], description: "Straight boundary on leg side" },
                { name: "Deep Mid-Wicket", position: [-75, 35], description: "Deep on leg side boundary" },
                { name: "Deep Square Leg", position: [-80, -5], description: "Deep square on leg side boundary" },
                { name: "Fine Leg", position: [-65, -60], description: "Deep behind square on leg side" },
                { name: "Long Leg", position: [-70, -45], description: "Wider than fine leg on boundary" },
                { name: "Cow Corner", position: [-60, 60], description: "Between deep mid-wicket and long-on" },
                { name: "Deep Backward Square Leg", position: [-75, -25], description: "Deep behind square leg on boundary" }
            ]
        };
    }

    initializePresetFormations() {
        return {
            attacking: {
                name: 'Attacking',
                description: 'Close fielders for taking wickets',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [8, -18], name: 'First Slip' },
                    { role: 'fielder', position: [15, -20], name: 'Second Slip' },
                    { role: 'fielder', position: [22, -22], name: 'Third Slip' },
                    { role: 'fielder', position: [30, -15], name: 'Gully' },
                    { role: 'fielder', position: [-25, 8], name: 'Short Leg' },
                    { role: 'fielder', position: [25, 8], name: 'Silly Point' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [20, 45], name: 'Mid-Off' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' }
                ]
            },
            defensive: {
                name: 'Defensive',
                description: 'Deep fielders to prevent boundaries',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [75, 35], name: 'Deep Cover' },
                    { role: 'fielder', position: [35, 75], name: 'Long Off' },
                    { role: 'fielder', position: [-35, 75], name: 'Long On' },
                    { role: 'fielder', position: [-75, 35], name: 'Deep Mid-Wicket' },
                    { role: 'fielder', position: [-80, -5], name: 'Deep Square Leg' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' },
                    { role: 'fielder', position: [65, -60], name: 'Third Man' },
                    { role: 'fielder', position: [45, 25], name: 'Cover' }
                ]
            },
            'offside-heavy': {
                name: 'Off-side Heavy',
                description: '6-3 field with majority on off side',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [8, -18], name: 'First Slip' },
                    { role: 'fielder', position: [15, -20], name: 'Second Slip' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [45, 25], name: 'Cover' },
                    { role: 'fielder', position: [35, 35], name: 'Extra Cover' },
                    { role: 'fielder', position: [20, 45], name: 'Mid-Off' },
                    { role: 'fielder', position: [65, -60], name: 'Third Man' },
                    { role: 'fielder', position: [-20, 45], name: 'Mid-On' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' }
                ]
            },
            'legside-heavy': {
                name: 'Leg-side Heavy',
                description: '3-6 field with majority on leg side',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [20, 45], name: 'Mid-Off' },
                    { role: 'fielder', position: [65, -60], name: 'Third Man' },
                    { role: 'fielder', position: [-20, 45], name: 'Mid-On' },
                    { role: 'fielder', position: [-45, 25], name: 'Mid-Wicket' },
                    { role: 'fielder', position: [-50, 0], name: 'Square Leg' },
                    { role: 'fielder', position: [-45, -15], name: 'Backward Square Leg' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' },
                    { role: 'fielder', position: [-70, -45], name: 'Long Leg' }
                ]
            },
            'new-ball': {
                name: 'New Ball',
                description: 'Standard new ball attack field',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [8, -18], name: 'First Slip' },
                    { role: 'fielder', position: [15, -20], name: 'Second Slip' },
                    { role: 'fielder', position: [30, -15], name: 'Gully' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [45, 25], name: 'Cover' },
                    { role: 'fielder', position: [20, 45], name: 'Mid-Off' },
                    { role: 'fielder', position: [-20, 45], name: 'Mid-On' },
                    { role: 'fielder', position: [-50, 0], name: 'Square Leg' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' }
                ]
            },
            'spin-bowling': {
                name: 'Spin Bowling',
                description: 'Close catchers for spin bowling',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [8, -18], name: 'First Slip' },
                    { role: 'fielder', position: [-25, 8], name: 'Short Leg' },
                    { role: 'fielder', position: [25, 8], name: 'Silly Point' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [45, 25], name: 'Cover' },
                    { role: 'fielder', position: [20, 45], name: 'Mid-Off' },
                    { role: 'fielder', position: [-20, 45], name: 'Mid-On' },
                    { role: 'fielder', position: [-45, 25], name: 'Mid-Wicket' },
                    { role: 'fielder', position: [-50, 0], name: 'Square Leg' }
                ]
            },
            'death-bowling': {
                name: 'Death Bowling',
                description: 'Boundary protection for death overs',
                positions: [
                    { role: 'bowler', position: [0, 50], name: 'Bowler' },
                    { role: 'keeper', position: [0, -15], name: 'Keeper' },
                    { role: 'fielder', position: [50, 0], name: 'Point' },
                    { role: 'fielder', position: [75, 35], name: 'Deep Cover' },
                    { role: 'fielder', position: [35, 75], name: 'Long Off' },
                    { role: 'fielder', position: [-35, 75], name: 'Long On' },
                    { role: 'fielder', position: [-60, 60], name: 'Cow Corner' },
                    { role: 'fielder', position: [-75, 35], name: 'Deep Mid-Wicket' },
                    { role: 'fielder', position: [-80, -5], name: 'Deep Square Leg' },
                    { role: 'fielder', position: [65, -60], name: 'Third Man' },
                    { role: 'fielder', position: [-65, -60], name: 'Fine Leg' }
                ]
            }
        };
    }

    createPlayers() {
        // Create 11 players
        const playerRoles = [
            { role: 'bowler', name: 'Bowler', number: 1 },
            { role: 'keeper', name: 'Keeper', number: 2 }
        ];
        
        // Add 9 fielders
        for (let i = 3; i <= 11; i++) {
            playerRoles.push({ role: 'fielder', name: `Player ${i}`, number: i });
        }
        
        playerRoles.forEach((playerData, index) => {
            const player = this.createPlayer(playerData.role, playerData.name, playerData.number);
            this.players.push(player);
            this.playersContainer.appendChild(player.element);
        });
        
        this.updatePlayerList();
    }

    createPlayer(role, name, number) {
        const element = document.createElement('div');
        element.className = `player ${role}`;
        element.textContent = number;
        element.style.left = '250px';
        element.style.top = '250px';
        
        const player = {
            id: `player-${number}`,
            element,
            role,
            name,
            number,
            position: { x: 250, y: 250 },
            positionName: this.detectPosition(250, 250),
            isDragging: false
        };
        
        // Add event listeners
        this.setupPlayerEventListeners(player);
        
        return player;
    }

    setupPlayerEventListeners(player) {
        const element = player.element;
        
        // Mouse events
        element.addEventListener('mousedown', (e) => this.startDrag(e, player));
        element.addEventListener('mouseenter', (e) => this.showTooltip(e, player));
        element.addEventListener('mouseleave', () => this.hideTooltip());
        element.addEventListener('dblclick', () => this.editPlayer(player));
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e, player);
        }, { passive: false });
    }

    setupEventListeners() {
        // Global mouse events for dragging
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.endDrag());
        
        // Control events
        this.presetSelect.addEventListener('change', (e) => this.applyPreset(e.target.value));
        this.batsmanTypeSelect.addEventListener('change', (e) => this.handleBatsmanChange(e.target.value));
        this.bowlerTypeSelect.addEventListener('change', () => this.updateFormationAnalysis());
        this.overStageSelect.addEventListener('change', () => this.updateFormationAnalysis());
        
        // Button events
        this.fourSlipsBtn.addEventListener('click', () => this.applyQuickFormation('fourSlips'));
        this.ringFieldBtn.addEventListener('click', () => this.applyQuickFormation('ringField'));
        this.boundaryRidersBtn.addEventListener('click', () => this.applyQuickFormation('boundaryRiders'));
        this.saveFieldBtn.addEventListener('click', () => this.showSaveModal());
        this.exportBtn.addEventListener('click', () => this.exportField());
        this.resetFieldBtn.addEventListener('click', () => this.resetField());
        
        // Analysis buttons
        this.showCoverageBtn.addEventListener('click', () => this.toggleAnalysis('coverage'));
        this.showGapsBtn.addEventListener('click', () => this.toggleAnalysis('gaps'));
        this.showRestrictionsBtn.addEventListener('click', () => this.toggleAnalysis('restrictions'));
        
        // Modal events
        document.getElementById('cancelSaveBtn').addEventListener('click', () => this.hideSaveModal());
        document.getElementById('confirmSaveBtn').addEventListener('click', () => this.saveField());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.hidePlayerEditModal());
        document.getElementById('confirmEditBtn').addEventListener('click', () => this.savePlayerEdit());
        document.getElementById('saveCurrentBtn').addEventListener('click', () => this.showSaveModal());
        
        // Ground controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(110));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(90));
        document.getElementById('snapToGridBtn').addEventListener('click', () => this.toggleSnapToGrid());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startDrag(e, player) {
        this.draggedPlayer = player;
        this.isDragging = true;
        player.isDragging = true;
        player.element.classList.add('dragging');
        
        const rect = this.groundElement.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        player.dragOffset = {
            x: clientX - rect.left - player.position.x,
            y: clientY - rect.top - player.position.y
        };
        
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging || !this.draggedPlayer) return;
        
        const rect = this.groundElement.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        let x = clientX - rect.left - this.draggedPlayer.dragOffset.x;
        let y = clientY - rect.top - this.draggedPlayer.dragOffset.y;
        
        // Constrain within ground bounds
        const groundSize = 500;
        const playerSize = 20;
        x = Math.max(playerSize / 2, Math.min(groundSize - playerSize / 2, x));
        y = Math.max(playerSize / 2, Math.min(groundSize - playerSize / 2, y));
        
        // Apply snap to grid if enabled
        if (this.snapToGrid) {
            const gridSize = 25;
            x = Math.round(x / gridSize) * gridSize;
            y = Math.round(y / gridSize) * gridSize;
        }
        
        this.updatePlayerPosition(this.draggedPlayer, x, y);
        
        // Update tooltip position
        this.updateTooltip(e, this.draggedPlayer);
        
        e.preventDefault();
    }

    endDrag() {
        if (!this.isDragging || !this.draggedPlayer) return;
        
        this.draggedPlayer.isDragging = false;
        this.draggedPlayer.element.classList.remove('dragging');
        this.draggedPlayer.element.classList.add('placed');
        
        // Remove placed animation class after animation completes
        setTimeout(() => {
            this.draggedPlayer.element.classList.remove('placed');
        }, 300);
        
        this.updateFormationAnalysis();
        this.updateFieldBalance();
        
        this.draggedPlayer = null;
        this.isDragging = false;
    }

    updatePlayerPosition(player, x, y) {
        player.position = { x, y };
        player.element.style.left = `${x - 10}px`;
        player.element.style.top = `${y - 10}px`;
        
        // Update position name
        const positionName = this.detectPosition(x, y);
        if (positionName !== player.positionName) {
            player.positionName = positionName;
            this.updatePlayerList();
        }
    }

    detectPosition(x, y) {
        const centerX = 250;
        const centerY = 250;
        const relativeX = x - centerX;
        const relativeY = y - centerY;
        const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
        const angle = Math.atan2(relativeY, relativeX) * (180 / Math.PI);
        
        // Adjust angle to be relative to bowler's end
        let adjustedAngle = angle + 90;
        if (adjustedAngle < 0) adjustedAngle += 360;
        if (adjustedAngle >= 360) adjustedAngle -= 360;
        
        // Flip for left-handed batsman
        if (this.isLeftHandedBatsman) {
            adjustedAngle = 360 - adjustedAngle;
        }
        
        // Define position ranges based on distance and angle
        if (distance < 50) {
            // Close catching positions
            if (Math.abs(relativeY) < 20 && Math.abs(relativeX) < 20) return 'Wicket Keeper';
            if (adjustedAngle > 300 || adjustedAngle < 60) {
                if (relativeX > 0) return 'First Slip';
                if (relativeX < 0) return 'Leg Slip';
            }
            if (adjustedAngle >= 60 && adjustedAngle <= 120) {
                return relativeX > 0 ? 'Silly Point' : 'Silly Mid-Off';
            }
            if (adjustedAngle >= 240 && adjustedAngle <= 300) {
                return relativeX < 0 ? 'Short Leg' : 'Silly Mid-On';
            }
        } else if (distance < 120) {
            // Inner ring positions
            if (adjustedAngle >= 45 && adjustedAngle <= 135) {
                if (adjustedAngle < 70) return 'Point';
                if (adjustedAngle < 100) return 'Cover';
                if (adjustedAngle < 120) return 'Mid-Off';
                return 'Extra Cover';
            }
            if (adjustedAngle >= 225 && adjustedAngle <= 315) {
                if (adjustedAngle < 250) return 'Mid-On';
                if (adjustedAngle < 280) return 'Mid-Wicket';
                if (adjustedAngle < 300) return 'Square Leg';
                return 'Backward Square Leg';
            }
            if (adjustedAngle >= 315 || adjustedAngle <= 45) {
                return adjustedAngle > 350 || adjustedAngle < 10 ? 'Short Fine Leg' : 
                       (relativeX > 0 ? 'Backward Point' : 'Short Third Man');
            }
        } else {
            // Outfield positions
            if (adjustedAngle >= 30 && adjustedAngle <= 150) {
                if (adjustedAngle < 60) return 'Third Man';
                if (adjustedAngle < 90) return 'Deep Point';
                if (adjustedAngle < 120) return 'Deep Cover';
                return 'Long Off';
            }
            if (adjustedAngle >= 210 && adjustedAngle <= 330) {
                if (adjustedAngle < 240) return 'Long On';
                if (adjustedAngle < 270) return 'Cow Corner';
                if (adjustedAngle < 300) return 'Deep Mid-Wicket';
                return 'Deep Square Leg';
            }
            if (adjustedAngle >= 330 || adjustedAngle <= 30) {
                return adjustedAngle > 350 || adjustedAngle < 10 ? 'Fine Leg' : 
                       (relativeX > 0 ? 'Deep Backward Point' : 'Long Leg');
            }
        }
        
        return 'Custom Position';
    }

    getPositionDescription(positionName) {
        const allPositions = [...this.positions.close_catching, ...this.positions.inner_ring, ...this.positions.outfield];
        const position = allPositions.find(p => p.name === positionName);
        return position ? position.description : 'Custom field position';
    }

    showTooltip(e, player) {
        if (player.isDragging) return;
        
        const tooltipContent = this.tooltip.querySelector('.tooltip-content');
        const positionName = tooltipContent.querySelector('.position-name');
        const positionDescription = tooltipContent.querySelector('.position-description');
        
        positionName.textContent = `${player.name} - ${player.positionName}`;
        positionDescription.textContent = this.getPositionDescription(player.positionName);
        
        this.updateTooltip(e, player);
        this.tooltip.classList.add('visible');
    }

    updateTooltip(e, player) {
        const rect = this.groundElement.getBoundingClientRect();
        const tooltipX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left + 15;
        const tooltipY = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top - 10;
        
        this.tooltip.style.left = `${tooltipX}px`;
        this.tooltip.style.top = `${tooltipY}px`;
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    applyPreset(presetName) {
        if (presetName === 'custom') return;
        
        const preset = this.presetFormations[presetName];
        if (!preset) return;
        
        this.currentFormation = presetName;
        
        preset.positions.forEach((pos, index) => {
            if (index < this.players.length) {
                const player = this.players[index];
                const x = pos.position[0] + 250;
                const y = pos.position[1] + 250;
                
                this.updatePlayerPosition(player, x, y);
                player.name = pos.name;
                player.role = pos.role;
                player.element.className = `player ${pos.role}`;
            }
        });
        
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
    }

    applyQuickFormation(type) {
        switch (type) {
            case 'fourSlips':
                this.setFourSlips();
                break;
            case 'ringField':
                this.setRingField();
                break;
            case 'boundaryRiders':
                this.setBoundaryRiders();
                break;
        }
        
        this.presetSelect.value = 'custom';
        this.currentFormation = 'custom';
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
    }

    setFourSlips() {
        const slipPositions = [
            { x: 258, y: 232 }, // First slip
            { x: 265, y: 230 }, // Second slip
            { x: 272, y: 228 }, // Third slip
            { x: 280, y: 225 }  // Fourth slip
        ];
        
        let slipIndex = 0;
        this.players.forEach(player => {
            if (player.role === 'fielder' && slipIndex < 4) {
                this.updatePlayerPosition(player, slipPositions[slipIndex].x, slipPositions[slipIndex].y);
                player.name = `${this.getOrdinal(slipIndex + 1)} Slip`;
                slipIndex++;
            }
        });
    }

    setRingField() {
        const ringPositions = [
            { x: 300, y: 250, name: 'Point' },
            { x: 295, y: 275, name: 'Cover' },
            { x: 270, y: 295, name: 'Mid-Off' },
            { x: 230, y: 295, name: 'Mid-On' },
            { x: 205, y: 275, name: 'Mid-Wicket' },
            { x: 200, y: 250, name: 'Square Leg' }
        ];
        
        let ringIndex = 0;
        this.players.forEach(player => {
            if (player.role === 'fielder' && ringIndex < ringPositions.length) {
                const pos = ringPositions[ringIndex];
                this.updatePlayerPosition(player, pos.x, pos.y);
                player.name = pos.name;
                ringIndex++;
            }
        });
    }

    setBoundaryRiders() {
        const boundaryPositions = [
            { x: 325, y: 190, name: 'Third Man' },
            { x: 375, y: 285, name: 'Deep Cover' },
            { x: 285, y: 375, name: 'Long Off' },
            { x: 215, y: 375, name: 'Long On' },
            { x: 125, y: 285, name: 'Deep Mid-Wicket' },
            { x: 175, y: 190, name: 'Fine Leg' }
        ];
        
        let boundaryIndex = 0;
        this.players.forEach(player => {
            if (player.role === 'fielder' && boundaryIndex < boundaryPositions.length) {
                const pos = boundaryPositions[boundaryIndex];
                this.updatePlayerPosition(player, pos.x, pos.y);
                player.name = pos.name;
                boundaryIndex++;
            }
        });
    }

    handleBatsmanChange(handedness) {
        this.isLeftHandedBatsman = handedness === 'left-handed';
        
        // Update all player position names
        this.players.forEach(player => {
            player.positionName = this.detectPosition(player.position.x, player.position.y);
        });
        
        this.updatePlayerList();
        this.updateFormationAnalysis();
    }

    updateFieldBalance() {
        let offSide = 0;
        let legSide = 0;
        
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const relativeX = player.position.x - 250;
                if (this.isLeftHandedBatsman) {
                    if (relativeX < 0) offSide++;
                    else legSide++;
                } else {
                    if (relativeX > 0) offSide++;
                    else legSide++;
                }
            }
        });
        
        this.fieldBalanceDisplay.textContent = `${offSide}-${legSide} field`;
    }

    updatePlayerList() {
        this.playerList.innerHTML = '';
        
        this.players.forEach(player => {
            const item = document.createElement('div');
            item.className = 'player-item';
            item.innerHTML = `
                <div>
                    <div>${player.name}</div>
                    <div class="player-role">${player.role}</div>
                </div>
                <div>${player.positionName}</div>
            `;
            
            item.addEventListener('click', () => this.editPlayer(player));
            this.playerList.appendChild(item);
        });
    }

    editPlayer(player) {
        this.currentEditPlayer = player;
        document.getElementById('playerName').value = player.name;
        document.getElementById('playerRole').value = player.role;
        this.showPlayerEditModal();
    }

    showPlayerEditModal() {
        this.playerEditModal.classList.add('active');
    }

    hidePlayerEditModal() {
        this.playerEditModal.classList.remove('active');
        this.currentEditPlayer = null;
    }

    savePlayerEdit() {
        if (!this.currentEditPlayer) return;
        
        const newName = document.getElementById('playerName').value;
        const newRole = document.getElementById('playerRole').value;
        
        this.currentEditPlayer.name = newName;
        this.currentEditPlayer.role = newRole;
        this.currentEditPlayer.element.className = `player ${newRole}`;
        
        this.updatePlayerList();
        this.hidePlayerEditModal();
    }

    showSaveModal() {
        this.saveModal.classList.add('active');
        document.getElementById('fieldName').value = '';
        document.getElementById('fieldDescription').value = '';
    }

    hideSaveModal() {
        this.saveModal.classList.remove('active');
    }

    saveField() {
        const name = document.getElementById('fieldName').value.trim();
        const description = document.getElementById('fieldDescription').value.trim();
        
        if (!name) {
            alert('Please enter a name for the field setting');
            return;
        }
        
        const fieldData = {
            name,
            description,
            formation: this.currentFormation,
            players: this.players.map(player => ({
                name: player.name,
                role: player.role,
                position: player.position,
                positionName: player.positionName
            })),
            isLeftHandedBatsman: this.isLeftHandedBatsman,
            bowlerType: this.bowlerTypeSelect.value,
            overStage: this.overStageSelect.value,
            timestamp: new Date().toISOString()
        };
        
        this.savedFields.push(fieldData);
        this.saveSavedFields();
        this.updateSavedFieldsList();
        this.hideSaveModal();
        
        // Show success message
        this.showNotification(`Field "${name}" saved successfully!`, 'success');
    }

    loadSavedFields() {
        // In a real app, this would load from localStorage or an API
        this.savedFields = [];
        this.updateSavedFieldsList();
    }

    saveSavedFields() {
        // In a real app, this would save to localStorage or an API
        // For now, we'll just keep them in memory
    }

    updateSavedFieldsList() {
        this.savedFieldsContainer.innerHTML = '';
        
        this.savedFields.forEach((field, index) => {
            const item = document.createElement('div');
            item.className = 'saved-field-item';
            item.innerHTML = `
                <div style="font-weight: 500;">${field.name}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">${field.formation}</div>
            `;
            
            item.addEventListener('click', () => this.loadSavedField(field));
            this.savedFieldsContainer.appendChild(item);
        });
    }

    loadSavedField(fieldData) {
        this.currentFormation = fieldData.formation;
        this.isLeftHandedBatsman = fieldData.isLeftHandedBatsman;
        
        // Update controls
        this.batsmanTypeSelect.value = fieldData.isLeftHandedBatsman ? 'left-handed' : 'right-handed';
        this.bowlerTypeSelect.value = fieldData.bowlerType;
        this.overStageSelect.value = fieldData.overStage;
        this.presetSelect.value = fieldData.formation;
        
        // Update players
        fieldData.players.forEach((playerData, index) => {
            if (index < this.players.length) {
                const player = this.players[index];
                player.name = playerData.name;
                player.role = playerData.role;
                player.element.className = `player ${playerData.role}`;
                this.updatePlayerPosition(player, playerData.position.x, playerData.position.y);
            }
        });
        
        this.updatePlayerList();
        this.updateFormationAnalysis();
        this.updateFieldBalance();
        
        this.showNotification(`Loaded field "${fieldData.name}"`, 'success');
    }

    exportField() {
        // Create a canvas to export the field
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 600;
        
        // Draw ground background
        const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 250);
        gradient.addColorStop(0, '#2d5016');
        gradient.addColorStop(1, '#1a3d0b');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(300, 300, 250, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw boundary
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(300, 300, 240, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw pitch
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(260, 220, 80, 160);
        
        // Draw creases
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(260, 300);
        ctx.lineTo(340, 300);
        ctx.moveTo(260, 240);
        ctx.lineTo(340, 240);
        ctx.moveTo(260, 360);
        ctx.lineTo(340, 360);
        ctx.stroke();
        
        // Draw players
        this.players.forEach(player => {
            const x = (player.position.x / 500) * 500 + 50;
            const y = (player.position.y / 500) * 500 + 50;
            
            // Player circle
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            
            // Color based on role
            if (player.role === 'bowler') ctx.fillStyle = '#c0152f';
            else if (player.role === 'keeper') ctx.fillStyle = '#21808d';
            else ctx.fillStyle = '#21808d';
            
            ctx.fill();
            
            // Player number
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.number.toString(), x, y + 4);
            
            // Position name
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.fillText(player.positionName, x, y + 25);
        });
        
        // Download image
        const link = document.createElement('a');
        link.download = `cricket-field-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('Field exported as image', 'success');
    }

    resetField() {
        if (confirm('Are you sure you want to reset the field to default positions?')) {
            this.setDefaultFormation();
            this.presetSelect.value = 'custom';
            this.currentFormation = 'custom';
            this.updatePlayerList();
            this.updateFormationAnalysis();
            this.updateFieldBalance();
            this.showNotification('Field reset to default', 'info');
        }
    }

    setDefaultFormation() {
        const defaultPositions = [
            { x: 250, y: 200, role: 'bowler', name: 'Bowler' },
            { x: 250, y: 235, role: 'keeper', name: 'Keeper' },
            { x: 258, y: 232, role: 'fielder', name: 'First Slip' },
            { x: 265, y: 230, role: 'fielder', name: 'Second Slip' },
            { x: 300, y: 250, role: 'fielder', name: 'Point' },
            { x: 295, y: 275, role: 'fielder', name: 'Cover' },
            { x: 270, y: 295, role: 'fielder', name: 'Mid-Off' },
            { x: 230, y: 295, role: 'fielder', name: 'Mid-On' },
            { x: 205, y: 275, role: 'fielder', name: 'Mid-Wicket' },
            { x: 200, y: 250, role: 'fielder', name: 'Square Leg' },
            { x: 175, y: 190, role: 'fielder', name: 'Fine Leg' }
        ];
        
        defaultPositions.forEach((pos, index) => {
            if (index < this.players.length) {
                const player = this.players[index];
                player.role = pos.role;
                player.name = pos.name;
                player.element.className = `player ${pos.role}`;
                this.updatePlayerPosition(player, pos.x, pos.y);
            }
        });
    }

    updateFormationAnalysis() {
        // Calculate field effectiveness
        let effectiveness = this.calculateFieldEffectiveness();
        
        this.effectivenessRating.style.width = `${effectiveness}%`;
        
        if (effectiveness >= 80) {
            this.effectivenessText.textContent = 'Excellent';
            this.effectivenessRating.style.background = 'var(--color-success)';
        } else if (effectiveness >= 60) {
            this.effectivenessText.textContent = 'Good';
            this.effectivenessRating.style.background = 'var(--color-success)';
        } else if (effectiveness >= 40) {
            this.effectivenessText.textContent = 'Average';
            this.effectivenessRating.style.background = 'var(--color-warning)';
        } else {
            this.effectivenessText.textContent = 'Poor';
            this.effectivenessRating.style.background = 'var(--color-error)';
        }
    }

    calculateFieldEffectiveness() {
        let score = 50; // Base score
        
        // Check for balanced field
        const balance = this.getFieldBalance();
        if (Math.abs(balance.offSide - balance.legSide) <= 2) score += 15;
        else if (Math.abs(balance.offSide - balance.legSide) > 4) score -= 10;
        
        // Check for appropriate bowling field
        const bowlerType = this.bowlerTypeSelect.value;
        const overStage = this.overStageSelect.value;
        
        if (bowlerType === 'fast' && this.hasSlips()) score += 10;
        if (bowlerType === 'spin' && this.hasCloseFielders()) score += 10;
        if (overStage === 'death-overs' && this.hasBoundaryProtection()) score += 15;
        
        // Check for gaps in field
        if (this.hasFieldGaps()) score -= 15;
        
        return Math.max(0, Math.min(100, score));
    }

    getFieldBalance() {
        let offSide = 0;
        let legSide = 0;
        
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const relativeX = player.position.x - 250;
                if (this.isLeftHandedBatsman) {
                    if (relativeX < 0) offSide++;
                    else legSide++;
                } else {
                    if (relativeX > 0) offSide++;
                    else legSide++;
                }
            }
        });
        
        return { offSide, legSide };
    }

    hasSlips() {
        return this.players.some(player => 
            player.positionName.includes('Slip') && 
            this.getDistanceFromCenter(player) < 60
        );
    }

    hasCloseFielders() {
        const closePositions = ['Silly Point', 'Short Leg', 'Silly Mid-Off', 'Silly Mid-On'];
        return this.players.some(player => 
            closePositions.includes(player.positionName)
        );
    }

    hasBoundaryProtection() {
        const boundaryCount = this.players.filter(player => 
            this.getDistanceFromCenter(player) > 180
        ).length;
        return boundaryCount >= 6;
    }

    hasFieldGaps() {
        // Simplified gap detection
        const sectors = Array(8).fill(0);
        
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const angle = this.getAngleFromCenter(player);
                const sector = Math.floor(angle / 45);
                sectors[sector]++;
            }
        });
        
        return sectors.some(count => count === 0);
    }

    getDistanceFromCenter(player) {
        const centerX = 250;
        const centerY = 250;
        const dx = player.position.x - centerX;
        const dy = player.position.y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getAngleFromCenter(player) {
        const centerX = 250;
        const centerY = 250;
        const dx = player.position.x - centerX;
        const dy = player.position.y - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        return angle;
    }

    toggleAnalysis(type) {
        const overlay = document.getElementById(`${type}Overlay`);
        overlay.classList.toggle('active');
        
        // Hide other overlays
        ['coverage', 'gaps', 'restrictions'].forEach(overlayType => {
            if (overlayType !== type) {
                document.getElementById(`${overlayType}Overlay`).classList.remove('active');
            }
        });
        
        if (overlay.classList.contains('active')) {
            this.showAnalysis(type);
        }
    }

    showAnalysis(type) {
        const overlay = document.getElementById(`${type}Overlay`);
        overlay.innerHTML = ''; // Clear previous analysis
        
        switch (type) {
            case 'coverage':
                this.showCoverageAnalysis(overlay);
                break;
            case 'gaps':
                this.showGapAnalysis(overlay);
                break;
            case 'restrictions':
                this.showRestrictionsAnalysis(overlay);
                break;
        }
    }

    showCoverageAnalysis(overlay) {
        // Create coverage circles around each fielder
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const circle = document.createElement('div');
                circle.style.position = 'absolute';
                circle.style.left = `${player.position.x - 25}px`;
                circle.style.top = `${player.position.y - 25}px`;
                circle.style.width = '50px';
                circle.style.height = '50px';
                circle.style.border = '2px solid rgba(0, 255, 0, 0.5)';
                circle.style.borderRadius = '50%';
                circle.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                overlay.appendChild(circle);
            }
        });
    }

    showGapAnalysis(overlay) {
        // Identify and highlight gaps in the field
        const gapZones = this.identifyGaps();
        
        gapZones.forEach(gap => {
            const gapIndicator = document.createElement('div');
            gapIndicator.style.position = 'absolute';
            gapIndicator.style.left = `${gap.x - 15}px`;
            gapIndicator.style.top = `${gap.y - 15}px`;
            gapIndicator.style.width = '30px';
            gapIndicator.style.height = '30px';
            gapIndicator.style.border = '2px solid rgba(255, 0, 0, 0.8)';
            gapIndicator.style.borderRadius = '50%';
            gapIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            overlay.appendChild(gapIndicator);
        });
    }

    showRestrictionsAnalysis(overlay) {
        // Show fielding restrictions based on format
        const restrictionCircle = document.createElement('div');
        restrictionCircle.style.position = 'absolute';
        restrictionCircle.style.left = '125px';
        restrictionCircle.style.top = '125px';
        restrictionCircle.style.width = '250px';
        restrictionCircle.style.height = '250px';
        restrictionCircle.style.border = '3px dashed rgba(255, 255, 0, 0.8)';
        restrictionCircle.style.borderRadius = '50%';
        restrictionCircle.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
        overlay.appendChild(restrictionCircle);
        
        // Add restriction text
        const restrictionText = document.createElement('div');
        restrictionText.style.position = 'absolute';
        restrictionText.style.left = '200px';
        restrictionText.style.top = '100px';
        restrictionText.style.color = 'rgba(255, 255, 0, 0.9)';
        restrictionText.style.fontWeight = 'bold';
        restrictionText.style.fontSize = '12px';
        restrictionText.textContent = '30-yard circle';
        overlay.appendChild(restrictionText);
    }

    identifyGaps() {
        // Simplified gap detection - returns positions where there are no fielders nearby
        const gaps = [];
        const testPositions = [
            { x: 200, y: 200 }, { x: 250, y: 180 }, { x: 300, y: 200 },
            { x: 320, y: 250 }, { x: 300, y: 300 }, { x: 250, y: 320 },
            { x: 200, y: 300 }, { x: 180, y: 250 }
        ];
        
        testPositions.forEach(testPos => {
            const nearestFielder = this.findNearestFielder(testPos.x, testPos.y);
            if (nearestFielder && this.getDistance(testPos, nearestFielder.position) > 60) {
                gaps.push(testPos);
            }
        });
        
        return gaps;
    }

    findNearestFielder(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        
        this.players.forEach(player => {
            if (player.role === 'fielder') {
                const distance = this.getDistance({ x, y }, player.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = player;
                }
            }
        });
        
        return nearest;
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    zoom(factor) {
        this.currentZoom = Math.max(50, Math.min(200, this.currentZoom * (factor / 100)));
        this.groundElement.style.transform = `scale(${this.currentZoom / 100})`;
        document.getElementById('zoomLevel').textContent = `${Math.round(this.currentZoom)}%`;
    }

    toggleSnapToGrid() {
        this.snapToGrid = !this.snapToGrid;
        const btn = document.getElementById('snapToGridBtn');
        btn.textContent = this.snapToGrid ? 'Grid: ON' : 'Snap to Grid';
        btn.style.backgroundColor = this.snapToGrid ? 'var(--color-success)' : '';
    }

    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.showSaveModal();
                    break;
                case 'z':
                    e.preventDefault();
                    this.resetField();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportField();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            // Hide all modals and overlays
            this.hideSaveModal();
            this.hidePlayerEditModal();
            document.querySelectorAll('.coverage-overlay, .gaps-overlay, .restrictions-overlay')
                .forEach(overlay => overlay.classList.remove('active'));
        }
    }

    getOrdinal(n) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '10001';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'transform 0.3s ease';
        notification.textContent = message;
        
        // Set color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = 'var(--color-success)';
                break;
            case 'error':
                notification.style.backgroundColor = 'var(--color-error)';
                break;
            case 'warning':
                notification.style.backgroundColor = 'var(--color-warning)';
                break;
            default:
                notification.style.backgroundColor = 'var(--color-info)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CricketFieldPlanner();
});